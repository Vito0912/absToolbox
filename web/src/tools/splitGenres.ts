import { useApi } from '@/composables/useApi'
import type { ToolResult } from '@/types/tool'

async function getAllBooksForGenre(genre: string, libraryId: string) {
  const { get } = useApi()
  try {
    const base64Genre = btoa(unescape(encodeURIComponent(genre))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await get(`/api/libraries/${libraryId}/items?filter=genres.${base64Genre}`)
    console.log(`Fetched ${response.data.results.length} books for genre ${genre} in library ${libraryId}`)
    return response.data.results || []
  } catch (error) {
    console.error(`Error fetching books for genre ${genre} in library ${libraryId}:`, error)
    return []
  }
}

async function appendGenreToBook(book: any, genre: string, delimiter: string, type: 'genres' | 'tags') {
  const { patch } = useApi()
  const bookId = book.id
  const genres = genre.split(delimiter).map((g: string) => g.trim())

  try {
    await patch(`/api/items/${bookId}/media`, {
      metadata: {
        [type]: [...new Set([...book.media.metadata[type], ...genres].filter(g => g !== genre))]
      }
    })
   
  } catch (error) {
    console.error(`Error appending genre ${genre} to book ${bookId}:`, error)
  }
}

export async function executeSplitGenres(formData: Record<string, any>): Promise<ToolResult> {
  const { get, post } = useApi()
  
  try {
    const { type, libraryIds, delimiter } = formData
    let logs = []

    console.log('Executing split genres with formData:', formData)

    const libraryResponse = await get('/api/libraries')

    const processableLibraries = [];

    for (const library of libraryResponse.data.libraries) {
      if (libraryIds.length === 0 || libraryIds.includes(library.id)) {
        processableLibraries.push(library.id)
      }
    }

    logs.push(`Processing ${processableLibraries.length} libraries (${libraryIds.join(', ')}).`)

    const genres = (await get(`/api/${type}`)).data.genres || [];

    const multiGenres = [];

    for (const genre of genres) {
      if (genre.split(delimiter).length > 1 && !formData.skip.includes(genre)) {
        multiGenres.push(genre);
      }
    }

     for (const genre of multiGenres) {
       logs.push(`Processing genre ${genre}`);
       const bookTitlesOverall: string[] = [];
       for (const libraryId of processableLibraries) {
         const books = await getAllBooksForGenre(genre, libraryId);
         const bookTitles = books.map((book: any) => book.media.metadata.title);
         bookTitlesOverall.push(...bookTitles);
         for (const book of books) {
           try {
             await appendGenreToBook(book, genre, delimiter, type);
             logs.push(`Successfully appended genre ${genre} to book ${book.id}`);
           } catch (e) {
             console.log(`Error processing book ${book.id}: ${e}`);
           }
         }
       }
       logs.push(`Processed ${bookTitlesOverall.length} books for genre ${genre}: ${bookTitlesOverall.join(', ')}`);
     }

    return {
      success: true,
      message: `${type} split successfully`,
      data: logs,
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to split genres',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}