import { fetchLibraryIds } from '@/common/libraryIds'
import { useApi } from '@/composables/useApi'
import type { ToolResult } from '@/types/tool'

async function getAllLibraries() {
  const { get } = useApi()
  try {
    const response = await get('/api/libraries')
    return response.data.libraries || []
  } catch (error) {
    console.error('Error fetching libraries:', error)
    return []
  }
}

async function getLibraryAuthors(libraryId: string) {
  const { get } = useApi()
  try {
    const response = await get(`/api/libraries/${libraryId}/authors`)
    return response.data.authors || []
  } catch (error) {
    console.error(`Error fetching authors for library ${libraryId}:`, error)
    return []
  }
}

async function deleteAuthor(authorId: string) {
  const { apiClient } = useApi()
  try {
    await apiClient.value.delete(`/api/authors/${authorId}`)
    return true
  } catch (error) {
    console.error(`Error deleting author ${authorId}:`, error)
    return false
  }
}

export async function executeRemoveEmptyAuthors(formData: Record<string, any>): Promise<ToolResult> {
  try {
    const {
      libraryIds = [],
      deleteWithoutConfirmation = false
    } = formData

    const logs: string[] = []

    const processableLibraries = await fetchLibraryIds(libraryIds);

    logs.push(`Processing ${processableLibraries.length} libraries`)

    let totalAuthorsToDelete = 0
    let totalAuthorsDeleted = 0
    let totalAuthorsDeletionFailed = 0

    for (const libraryId of processableLibraries) {
      logs.push(`\nProcessing library ${libraryId}`)
      
      const authors = await getLibraryAuthors(libraryId)
      const authorsToDelete: Array<{id: string, name: string, numBooks: number}> = []

      // Find authors with 0 books
      for (const author of authors) {
        if (author.numBooks === 0) {
          authorsToDelete.push({
            id: author.id,
            name: author.name,
            numBooks: author.numBooks
          })
        }
      }

      logs.push(`Found ${authorsToDelete.length} authors without books`)
      
      if (authorsToDelete.length === 0) {
        logs.push('No orphaned authors found in this library')
        continue
      }

      logs.push('The following authors will be deleted:')
      for (const author of authorsToDelete) {
        logs.push(`- ${author.name} (${author.numBooks} books) - ID: ${author.id}`)
      }

      totalAuthorsToDelete += authorsToDelete.length
      
      for (const author of authorsToDelete) {
        const success = await deleteAuthor(author.id)
        if (success) {
          logs.push(`Deleted author: ${author.name}`)
          totalAuthorsDeleted++
        } else {
          logs.push(`Error deleting author: ${author.name}`)
          totalAuthorsDeletionFailed++
        }
      }

      logs.push('--- Deletion Complete ---\n')
    }

    logs.push('\n=== SUMMARY ===')
    logs.push(`Total authors found to delete: ${totalAuthorsToDelete}`)
    logs.push(`Total authors successfully deleted: ${totalAuthorsDeleted}`)
    logs.push(`Total authors failed to delete: ${totalAuthorsDeletionFailed}`)

    const message = deleteWithoutConfirmation 
      ? `Successfully processed ${processableLibraries.length} libraries. Deleted ${totalAuthorsDeleted} orphaned authors.`
      : `Found ${totalAuthorsToDelete} orphaned authors across ${processableLibraries.length} libraries. Enable 'Delete Without Confirmation' to actually delete them.`

    return {
      success: true,
      message: message,
      data: logs,
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to delete orphaned authors',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}