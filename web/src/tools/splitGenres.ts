import { useApi } from '@/composables/useApi'
import type { ToolResult } from '@/types/tool'

async function getAllBooksForGenre(genre: string, libraryId: string) {
  const { get, addLog } = useApi()
  try {
    const base64Genre = btoa(unescape(encodeURIComponent(genre))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await get(`/api/libraries/${libraryId}/items?filter=genres.${base64Genre}`)
    const bookCount = response.data.results.length
    addLog(`Found ${bookCount} books for genre "${genre}" in library ${libraryId}`)
    return response.data.results || []
  } catch (error) {
    addLog(`Error fetching books for genre "${genre}" in library ${libraryId}`)
    console.error(`Error fetching books for genre ${genre} in library ${libraryId}:`, error)
    return []
  }
}

async function appendGenreToBook(book: any, genre: string, delimiter: string, type: 'genres' | 'tags') {
  const { patch, addLog } = useApi()
  const bookId = book.id
  const genres = genre.split(delimiter).map((g: string) => g.trim())

  try {
    await patch(`/api/items/${bookId}/media`, {
      metadata: {
        [type]: [...new Set([...book.media.metadata[type], ...genres].filter(g => g !== genre))]
      }
    })
    addLog(`Updated book: ${book.media.metadata.title}`)
  } catch (error) {
    addLog(`Error updating book: ${book.media.metadata.title}`)
    console.error(`Error appending genre ${genre} to book ${bookId}:`, error)
  }
}

export async function executeSplitGenres(formData: Record<string, any>): Promise<ToolResult> {
  const { get, post, addLog } = useApi()
  
  try {
    const { type, libraryIds, delimiter } = formData

    addLog('Starting split genres operation...')
    console.log('Executing split genres with formData:', formData)

    const libraryResponse = await get('/api/libraries')

    const processableLibraries = [];

    for (const library of libraryResponse.data.libraries) {
      if (libraryIds.length === 0 || libraryIds.includes(library.id)) {
        processableLibraries.push(library.id)
      }
    }

    const libraryMessage = `Processing ${processableLibraries.length} libraries`
    addLog(libraryMessage)

    const genres = (await get(`/api/${type}`)).data.genres || [];

    const multiGenres = [];

    for (const genre of genres) {
      if (genre.split(delimiter).length > 1 && !formData.skip.includes(genre)) {
        multiGenres.push(genre);
      }
    }

    addLog(`Found ${multiGenres.length} genres to split`)

     for (const genre of multiGenres) {
       const genreMessage = `Processing genre: ${genre}`
       addLog(genreMessage)
       
       const bookTitlesOverall: string[] = [];
       for (const libraryId of processableLibraries) {
         const books = await getAllBooksForGenre(genre, libraryId);
         const bookTitles = books.map((book: any) => book.media.metadata.title);
         bookTitlesOverall.push(...bookTitles);
         for (const book of books) {
           try {
             await appendGenreToBook(book, genre, delimiter, type);
           } catch (e) {
             console.log(`Error processing book ${book.id}: ${e}`);
           }
         }
       }
       addLog(`Processed ${bookTitlesOverall.length} books for genre ${genre}: ${bookTitlesOverall.join(', ')}`);
     }

    const successMessage = `${type} split operation completed successfully`
    addLog(successMessage)

    return {
      success: true,
      message: successMessage,
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    const errorMessage = 'Failed to split genres'
    addLog(errorMessage)
    return {
      success: false,
      message: errorMessage,
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}