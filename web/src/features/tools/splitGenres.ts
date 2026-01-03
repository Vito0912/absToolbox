import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

async function getAllBooksForGenre(
  genre: string,
  libraryId: string,
  type: string
) {
  const { get, addLog } = useApi();
  try {
    const base64Genre = btoa(unescape(encodeURIComponent(genre)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await get(
      `/api/libraries/${libraryId}/items?filter=${type}.${base64Genre}`
    );
    const bookCount = response.data.results.length;
    addLog(
      `Found ${bookCount} books for genre "${genre}" in library ${libraryId}`
    );
    return response.data.results || [];
  } catch (error) {
    addLog(`Error fetching books for genre "${genre}" in library ${libraryId}`);
    console.error(
      `Error fetching books for genre ${genre} in library ${libraryId}:`,
      error
    );
    return [];
  }
}

async function appendGenreToBook(
  book: any,
  genre: string,
  delimiter: string,
  type: "genres" | "tags"
) {
  const { patch, addLog } = useApi();
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
      await patch(`/api/items/${bookId}/media`, {
        metadata: { genres: updated },
      });
    } else {
      const current = Array.isArray(book.media?.tags) ? book.media.tags : [];
      const updated = [
        ...new Set([...current.filter((t: string) => t !== genre), ...genres]),
      ];
      await patch(`/api/items/${bookId}/media`, {
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
  formData: Record<string, any>
): Promise<ToolResult> {
  const { get, addLog } = useApi();

  try {
    let { type, libraryIds, delimiter, delimiterOverride } = formData;

    if (delimiterOverride) {
      delimiter = delimiterOverride;
      addLog(`Using delimiter override: ${delimiter}`);
    }

    addLog("Starting split genres operation...");
    console.log("Executing split genres with formData:", formData);

    const libraryResponse = await get("/api/libraries");

    const processableLibraries = [];

    for (const library of libraryResponse.data.libraries) {
      if (libraryIds.length === 0 || libraryIds.includes(library.id)) {
        processableLibraries.push(library.id);
      }
    }

    const libraryMessage = `Processing ${processableLibraries.length} libraries`;
    addLog(libraryMessage);

    let genres = (await get(`/api/${type}`)).data || [];
    genres = genres.genres || genres.tags || [];

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
        } books for genre ${genre}: ${bookTitlesOverall.join(", ")}`
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
    addLog(errorMessage);
    return {
      success: false,
      message: errorMessage,
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
