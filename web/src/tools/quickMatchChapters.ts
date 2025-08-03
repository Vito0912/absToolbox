import { useApi } from '@/composables/useApi'
import type { ToolResult } from '@/types/tool'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchLibraryItems(libraryId: string) {
  const { get } = useApi()
  try {
    const response = await get(`/api/libraries/${libraryId}/items`)
    return response.data.results || []
  } catch (error) {
    console.error('Error fetching library items:', error)
    return []
  }
}

async function searchForBook(title: string, author: string, provider: string) {
  const { get } = useApi()
  try {
    const encodedTitle = encodeURIComponent(title)
    const encodedAuthor = encodeURIComponent(author)
    const response = await get(`/api/search/books?title=${encodedTitle}&author=${encodedAuthor}&provider=${provider}`)
    return response.data || []
  } catch (error) {
    console.error(`Error searching for book "${title}":`, error)
    return []
  }
}

async function fetchBookDetails(bookId: string) {
  const { get } = useApi()
  try {
    const response = await get(`/api/items/${bookId}?expanded=1`)
    return response.data || null
  } catch (error) {
    console.error(`Error fetching book details for ${bookId}:`, error)
    return null
  }
}

async function fetchChaptersByAsin(asin: string, region: string) {
  const { get } = useApi()
  try {
    const response = await get(`/api/search/chapters?asin=${asin}&region=${region}`)
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data.chapters || []
  } catch (error) {
    console.error(`Error fetching chapters for ASIN ${asin}:`, error)
    return []
  }
}

async function updateBookChapters(bookId: string, chapters: any[]) {
  const { post } = useApi()
  try {
    await post(`/api/items/${bookId}/chapters`, { chapters })
    return true
  } catch (error) {
    console.error(`Error updating chapters for book ${bookId}:`, error)
    return false
  }
}

function createChaptersFromTracks(tracks: any[], bookDuration: number) {
  const chapters = []
  let currentTime = 0

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i]
    const duration = track.duration
    const trackTitle = track.metadata.filename.split('.')[0]

    chapters.push({
      id: i,
      start: currentTime,
      end: currentTime + duration,
      title: trackTitle,
      error: null
    })

    currentTime += duration - 0.001 // Subtract tiny amount to avoid rounding issues
    if (bookDuration < currentTime) {
      break
    }
  }

  return chapters
}

function createChaptersFromAsin(chapters: any[], bookDuration: number) {
  const newChapters = []

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i]
    const start = chapter.startOffsetMs / 1000
    const end = Math.min((chapter.startOffsetMs + chapter.lengthMs) / 1000, bookDuration)

    if (start >= bookDuration) {
      break
    }

    newChapters.push({
      id: i,
      start: start,
      end: end,
      title: chapter.title,
      error: null
    })
  }

  return newChapters
}

export async function executeMatchAudiobookChapters(formData: Record<string, any>): Promise<ToolResult> {
  try {
    const {
      chapterThreshold = 3,
      libraryId,
      provider = 'audible.com',
      region = 'US',
      disableRateProtection = false,
      searchForAsin = true,
      useTracksAsChapters = false
    } = formData

    const logs: string[] = []
    const bookInfo: Record<string, any> = {}

    logs.push(`Fetching library items from library: ${libraryId}`)
    
    const items = await fetchLibraryItems(libraryId)
    logs.push(`Found ${items.length} items in the library.`)

    // Process each item in the library
    for (const item of items) {
      const bookId = item.id
      const metadata = item.media.metadata
      const title = metadata.title || 'Unknown Title'
      const subtitle = metadata.subtitle || ''
      const authors = metadata.authorName || 'Unknown Author'
      
      bookInfo[bookId] = {
        id: bookId,
        title: title,
        status: 'ERROR',
        comment: 'Unknown Error',
        asin: 'N/A'
      }

      logs.push(`\n--- Processing Book: ${title} ---`)

      // Check if book has ASIN
      if (!metadata.asin) {
        bookInfo[bookId].status = 'NO_ASIN'
        bookInfo[bookId].asin = 'N/A'

        if (searchForAsin) {
          logs.push(`Searching for ASIN for "${title}"...`)
          const searchResults = await searchForBook(title, authors, provider)

          if (searchResults.length === 0) {
            logs.push(`Error matching book "${title}" (No results found).`)
            bookInfo[bookId].comment = 'ASIN retrieval failed'
            continue
          }

          const bestMatch = searchResults[0]
          const asin = bestMatch.asin

          if (!asin) {
            logs.push(`Error matching book "${title}" (No ASIN found).`)
            bookInfo[bookId].comment = 'ASIN retrieval failed - No ASIN found'
            continue
          }

          item.media.metadata.asin = asin
          metadata.asin = asin
          logs.push(`ASIN found: ${asin}`)
        }
      }

      // Check if ASIN is now available
      if (!item.media.metadata.asin) {
        if (useTracksAsChapters) {
          logs.push(`Using tracks as chapters for "${title}".`)
          bookInfo[bookId].status = 'TRACKS'
          
          const bookDetails = await fetchBookDetails(bookId)
          if (!bookDetails) {
            logs.push(`Error fetching book "${title}": Failed to get book details`)
            bookInfo[bookId].comment = 'Tracks retrieval failed'
            continue
          }

          const audioFiles = bookDetails.media.audioFiles || []
          if (audioFiles.length <= 1) {
            logs.push(`Error using tracks as chapters for "${title}" (No or 1 track found).`)
            bookInfo[bookId].comment = 'Tracks retrieval failed'
            continue
          }

          const currentChaptersNum = item.media.numChapters || 0
          const tracksNum = audioFiles.length

          if (currentChaptersNum === 0 || Math.abs(currentChaptersNum - tracksNum) > chapterThreshold) {
            logs.push(`Chapters are missing or incorrect for "${title}" (Current num: ${currentChaptersNum}, Tracks num: ${tracksNum}). Updating...`)
            
            const newChapters = createChaptersFromTracks(audioFiles, item.media.duration)
            const success = await updateBookChapters(bookId, newChapters)

            if (success) {
              logs.push(`Chapters updated successfully for "${title}" (Using tracks!).`)
              bookInfo[bookId].comment = 'Tracks used as chapters'
              bookInfo[bookId].status = 'FINISHED'
            } else {
              logs.push(`Error updating chapters for "${title}".`)
              bookInfo[bookId].comment = 'Chapters update failed'
            }
          } else {
            logs.push(`Chapters are fine for "${title}".`)
            bookInfo[bookId].status = 'FINISHED'
            bookInfo[bookId].comment = 'No chapters to update'
          }
          continue
        } else {
          logs.push(`Skipping book "${title}" (No ASIN found and Tracks not used as source).`)
          bookInfo[bookId].comment = 'ASIN retrieval failed'
          continue
        }
      } else {
        bookInfo[bookId].asin = item.media.metadata.asin
      }

      // Fetch chapters using ASIN
      const asin = item.media.metadata.asin
      logs.push(`Fetching chapters for ASIN: ${asin}`)
      
      const chapters = await fetchChaptersByAsin(asin, region)
      
      if (chapters.length === 0) {
        bookInfo[bookId].comment = 'No chapters found'
        logs.push(`No chapters found for "${title}".`)
        continue
      }

      logs.push(`Chapters found for "${title}": ${chapters.length}`)

      // Compare current and found chapters
      const currentChaptersNum = item.media.numChapters || 0
      const foundChaptersNum = chapters.length
      logs.push(`Current chapter count: ${currentChaptersNum}`)

      if (Math.abs(currentChaptersNum - foundChaptersNum) > chapterThreshold || currentChaptersNum === 0) {
        logs.push(`Chapters are missing or incorrect for "${title}". Updating...`)

        const newChapters = createChaptersFromAsin(chapters, item.media.duration)
        const success = await updateBookChapters(bookId, newChapters)

        if (success) {
          logs.push(`Chapters updated successfully for "${title}".`)
          bookInfo[bookId].status = 'FINISHED'
          bookInfo[bookId].comment = 'Chapters updated'
        } else {
          logs.push(`Error updating chapters for "${title}".`)
          bookInfo[bookId].comment = 'Chapters update failed'
        }
      } else {
        bookInfo[bookId].status = 'FINISHED'
        bookInfo[bookId].comment = 'No chapters to update'
        logs.push(`Chapters are fine for "${title}".`)
      }

      if (!disableRateProtection) {
        await delay(2000)
      }
    }

    logs.push('\n--- Summary ---')
    for (const [bookId, info] of Object.entries(bookInfo)) {
      logs.push(`${info.title} (${info.status}): ${info.comment}`)
      logs.push('-'.repeat(50))
    }

    logs.push('\n--- Failed Books ---')
    for (const [bookId, info] of Object.entries(bookInfo)) {
      if (info.status !== 'FINISHED') {
        logs.push(`${info.title} (${info.status}): ${info.comment}`)
        logs.push('-'.repeat(50))
      }
    }

    return {
      success: true,
      message: 'Audiobook chapters matching completed',
      data: logs,
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to match audiobook chapters',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}