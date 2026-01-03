import { fetchLibraryIds } from "@/common/libraryIds";
import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

const { get, apiClient, addLog } = useApi();

async function getLibraryAuthors(libraryId: string) {
  try {
    const response = await get(`/api/libraries/${libraryId}/authors`);
    return response.data.authors || [];
  } catch (error) {
    console.error(`Error fetching authors for library ${libraryId}:`, error);
    return [];
  }
}

async function deleteAuthor(authorId: string) {
  try {
    await apiClient.value.delete(`/api/authors/${authorId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting author ${authorId}:`, error);
    return false;
  }
}

export async function executeRemoveEmptyAuthors(
  formData: Record<string, any>
): Promise<ToolResult> {
  try {
    const { libraryIds = [], deleteWithoutConfirmation = false } = formData;

    const processableLibraries = await fetchLibraryIds(libraryIds);

    addLog(`Processing ${processableLibraries.length} libraries`);

    let totalAuthorsToDelete = 0;
    let totalAuthorsDeleted = 0;
    let totalAuthorsDeletionFailed = 0;

    for (const libraryId of processableLibraries) {
      addLog(`\nProcessing library ${libraryId}`);

      const authors = await getLibraryAuthors(libraryId);
      const authorsToDelete: Array<{
        id: string;
        name: string;
        numBooks: number;
      }> = [];

      // Find authors with 0 books
      for (const author of authors) {
        if (author.numBooks === 0) {
          authorsToDelete.push({
            id: author.id,
            name: author.name,
            numBooks: author.numBooks,
          });
        }
      }

      addLog(`Found ${authorsToDelete.length} authors without books`);

      if (authorsToDelete.length === 0) {
        addLog("No orphaned authors found in this library");
        continue;
      }

      addLog("The following authors will be deleted:");
      for (const author of authorsToDelete) {
        addLog(
          `- ${author.name} (${author.numBooks} books) - ID: ${author.id}`
        );
      }

      totalAuthorsToDelete += authorsToDelete.length;

      for (const author of authorsToDelete) {
        const success = await deleteAuthor(author.id);
        if (success) {
          addLog(`Deleted author: ${author.name}`);
          totalAuthorsDeleted++;
        } else {
          addLog(`Error deleting author: ${author.name}`);
          totalAuthorsDeletionFailed++;
        }
      }

      addLog("--- Deletion Complete ---\n");
    }

    addLog("\n=== SUMMARY ===");
    addLog(`Total authors found to delete: ${totalAuthorsToDelete}`);
    addLog(`Total authors successfully deleted: ${totalAuthorsDeleted}`);
    addLog(`Total authors failed to delete: ${totalAuthorsDeletionFailed}`);

    const message = deleteWithoutConfirmation
      ? `Successfully processed ${processableLibraries.length} libraries. Deleted ${totalAuthorsDeleted} orphaned authors.`
      : `Found ${totalAuthorsToDelete} orphaned authors across ${processableLibraries.length} libraries. Enable 'Delete Without Confirmation' to actually delete them.`;

    return {
      success: true,
      message: message,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to delete orphaned authors",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
