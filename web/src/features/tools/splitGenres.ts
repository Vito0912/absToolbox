import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";
import {
  AbsGenresResponse,
  AbsLibraryItemMinified,
  AbsTagsResponse,
} from "@vito0912/abs-ts-sdk";

const { addLog, absClient } = useApi();

async function getAllBooksForGenre(
  genre: string,
  libraryId: string,
  type: string,
): Promise<AbsLibraryItemMinified[]> {
  try {
    const books = await absClient.libraries.listItems(libraryId, {
      filter: {
        group: type as "genres" | "tags",
        value: genre,
      },
    });

    const bookCount = books.results.length;
    addLog(
      `Found ${bookCount} books for genre "${genre}" in library ${libraryId}`,
    );
    return books.results || [];
  } catch (error) {
    addLog(`Error fetching books for genre "${genre}" in library ${libraryId}`);
    console.error(
      `Error fetching books for genre ${genre} in library ${libraryId}:`,
      error,
    );
    return [];
  }
}

async function appendGenreToBook(
  book: AbsLibraryItemMinified,
  genre: string,
  delimiter: string,
  type: "genres" | "tags",
) {
  const bookId = book.id;
  const genres = genre.split(delimiter).map((g: string) => g.trim());

  try {
    if (type === "genres") {
      const current = Array.isArray(book.media?.metadata?.genres)
        ? book.media.metadata.genres
        : [];
      const updated = [
        ...new Set([...current.filter((g: string) => g !== genre), ...genres]),
      ];
      await absClient.libraryItems.updateMedia(bookId, {
        metadata: {
          genres: updated,
        },
      });
    } else {
      const current = Array.isArray(book.media?.tags) ? book.media.tags : [];
      const updated = [
        ...new Set([...current.filter((t: string) => t !== genre), ...genres]),
      ];
      await absClient.libraryItems.updateMedia(bookId, {
        tags: updated,
      });
    }
    addLog(`Updated book: ${book.media.metadata.title}`);
  } catch (error) {
    addLog(`Error updating book: ${book.media.metadata.title}`);
    console.error(`Error appending genre ${genre} to book ${bookId}:`, error);
  }
}

export async function executeSplitGenres(
  formData: Record<string, any>,
): Promise<ToolResult> {
  try {
    let { type, libraryIds, delimiter, delimiterOverride } = formData;

    if (delimiterOverride) {
      delimiter = delimiterOverride;
      addLog(`Using delimiter override: ${delimiter}`);
    }

    addLog("Starting split genres operation...");
    console.log("Executing split genres with formData:", formData);

    const libraryResponse = await absClient.libraries.list();

    const processableLibraries = [];

    for (const library of libraryResponse.libraries) {
      if (libraryIds.length === 0 || libraryIds.includes(library.id)) {
        processableLibraries.push(library.id);
      }
    }

    const libraryMessage = `Processing ${processableLibraries.length} libraries`;
    addLog(libraryMessage);

    const genreResponse =
      (type == "genre"
        ? await absClient.misc.getGenres()
        : await absClient.misc.getTags()) || [];

    let genres =
      (genreResponse as AbsGenresResponse).genres ||
      (genreResponse as AbsTagsResponse).tags ||
      [];

    const multiGenres = [];

    for (const genre of genres) {
      addLog(`Checking genre: ${genre}`);
      if (genre.split(delimiter).length > 1 && !formData.skip.includes(genre)) {
        multiGenres.push(genre);
      }
    }

    addLog(`Found ${multiGenres.length} genres to split`);

    for (const genre of multiGenres) {
      const genreMessage = `Processing genre: ${genre}`;
      addLog(genreMessage);

      const bookTitlesOverall: string[] = [];
      for (const libraryId of processableLibraries) {
        const books = await getAllBooksForGenre(genre, libraryId, type);
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
      addLog(
        `Processed ${
          bookTitlesOverall.length
        } books for genre ${genre}: ${bookTitlesOverall.join(", ")}`,
      );
    }

    const successMessage = `${type} split operation completed successfully`;
    addLog(successMessage);

    return {
      success: true,
      message: successMessage,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const errorMessage = "Failed to split genres";
    console.error(errorMessage, error);
    addLog(errorMessage);
    return {
      success: false,
      message: errorMessage,
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
