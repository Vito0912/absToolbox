import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";
import {
  AbsBookLibraryItemExpanded,
  AbsBookLibraryItemMinified,
  AbsLibrary,
  AbsSearchChaptersData,
} from "@vito0912/abs-ts-sdk";
import { AbsLibraryItemChaptersUpdateRequest } from "@vito0912/abs-ts-sdk/types";

const { absClient, addLog } = useApi();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateBookChapters(
  bookId: string,
  chapters: AbsLibraryItemChaptersUpdateRequest,
) {
  try {
    await absClient.libraryItems.updateChapters(bookId, chapters);
    return true;
  } catch (error) {
    console.error(`Error updating chapters for book ${bookId}:`, error);
    return false;
  }
}

function createChaptersFromTracks(tracks: any[], bookDuration: number) {
  const chapters = [];
  let currentTime = 0;

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const duration = track.duration;
    const trackTitle = track.metadata.filename.split(".")[0];

    chapters.push({
      id: i,
      start: currentTime,
      end: currentTime + duration,
      title: trackTitle,
      error: null,
    });

    currentTime += duration - 0.001; // Subtract tiny amount to avoid rounding issues
    if (bookDuration < currentTime) {
      break;
    }
  }

  return chapters;
}

function createChaptersFromAsin(chapters: any[], bookDuration: number) {
  const newChapters = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const start = chapter.startOffsetMs / 1000;
    const end = Math.min(
      (chapter.startOffsetMs + chapter.lengthMs) / 1000,
      bookDuration,
    );

    if (start >= bookDuration) {
      break;
    }

    newChapters.push({
      id: i,
      start: start,
      end: end,
      title: chapter.title,
      error: null,
    });
  }

  return newChapters;
}

export async function executeMatchAudiobookChapters(
  formData: Record<string, any>,
): Promise<ToolResult> {
  try {
    const {
      chapterThreshold = 3,
      libraryId,
      provider = "audible.com",
      region = "US",
      disableRateProtection = false,
      searchForAsin = true,
      useTracksAsChapters = false,
    } = formData;

    const bookInfo: Record<string, any> = {};

    addLog(`Fetching library items from library: ${libraryId}`);

    const library = await absClient.libraries.getById(libraryId);
    if (!library || (library as AbsLibrary).mediaType !== "book") {
      throw new Error(`Library with ID ${libraryId} not a valid book library.`);
    }

    const items = ((await absClient.libraries.listItems(libraryId)).results ||
      []) as AbsBookLibraryItemMinified[];
    addLog(`Found ${items.length} items in the library.`);

    // Process each item in the library
    for (const item of items) {
      const bookId = item.id;
      const metadata = item.media.metadata;
      const title = metadata.title || "Unknown Title";
      const authors = metadata.authorName || "Unknown Author";

      bookInfo[bookId] = {
        id: bookId,
        title: title,
        status: "ERROR",
        comment: "Unknown Error",
        asin: "N/A",
      };

      addLog(`\n--- Processing Book: ${title} ---`);

      // Check if book has ASIN
      if (!metadata.asin) {
        bookInfo[bookId].status = "NO_ASIN";
        bookInfo[bookId].asin = "N/A";

        if (searchForAsin) {
          addLog(`Searching for ASIN for "${title}"...`);
          const searchResults = await absClient.search.getBooks({
            title,
            author: authors,
            provider,
          });

          if (searchResults.length === 0) {
            addLog(`Error matching book "${title}" (No results found).`);
            bookInfo[bookId].comment = "ASIN retrieval failed";
            continue;
          }

          const bestMatch = searchResults[0];
          const asin = bestMatch.asin;

          if (!asin) {
            addLog(`Error matching book "${title}" (No ASIN found).`);
            bookInfo[bookId].comment = "ASIN retrieval failed - No ASIN found";
            continue;
          }

          item.media.metadata.asin = asin;
          metadata.asin = asin;
          addLog(`ASIN found: ${asin}`);
        }
      }

      // Check if ASIN is now available
      if (!item.media.metadata.asin) {
        if (useTracksAsChapters) {
          addLog(`Using tracks as chapters for "${title}".`);
          bookInfo[bookId].status = "TRACKS";

          const bookDetails: AbsBookLibraryItemExpanded =
            (await absClient.libraryItems.getById(bookId, {
              expanded: true,
            })) as AbsBookLibraryItemExpanded;
          if (!bookDetails) {
            addLog(
              `Error fetching book "${title}": Failed to get book details`,
            );
            bookInfo[bookId].comment = "Tracks retrieval failed";
            continue;
          }

          const audioFiles = bookDetails.media.audioFiles || [];
          if (audioFiles.length <= 1) {
            addLog(
              `Error using tracks as chapters for "${title}" (No or 1 track found).`,
            );
            bookInfo[bookId].comment = "Tracks retrieval failed";
            continue;
          }

          const currentChaptersNum = item.media.numChapters || 0;
          const tracksNum = audioFiles.length;

          if (
            currentChaptersNum === 0 ||
            Math.abs(currentChaptersNum - tracksNum) > chapterThreshold
          ) {
            addLog(
              `Chapters are missing or incorrect for "${title}" (Current num: ${currentChaptersNum}, Tracks num: ${tracksNum}). Updating...`,
            );

            const newChapters = createChaptersFromTracks(
              audioFiles,
              item.media.duration,
            );
            const success = await updateBookChapters(bookId, {
              chapters: newChapters,
            });

            if (success) {
              addLog(
                `Chapters updated successfully for "${title}" (Using tracks!).`,
              );
              bookInfo[bookId].comment = "Tracks used as chapters";
              bookInfo[bookId].status = "FINISHED";
            } else {
              addLog(`Error updating chapters for "${title}".`);
              bookInfo[bookId].comment = "Chapters update failed";
            }
          } else {
            addLog(`Chapters are fine for "${title}".`);
            bookInfo[bookId].status = "FINISHED";
            bookInfo[bookId].comment = "No chapters to update";
          }
          continue;
        } else {
          addLog(
            `Skipping book "${title}" (No ASIN found and Tracks not used as source).`,
          );
          bookInfo[bookId].comment = "ASIN retrieval failed";
          continue;
        }
      } else {
        bookInfo[bookId].asin = item.media.metadata.asin;
      }

      // Fetch chapters using ASIN
      const asin = item.media.metadata.asin;
      addLog(`Fetching chapters for ASIN: ${asin}`);

      const chapters = (
        (await absClient.search.getChapters({
          asin: asin,
          region: region,
        })) as AbsSearchChaptersData
      ).chapters;

      if (chapters.length === 0) {
        bookInfo[bookId].comment = "No chapters found";
        addLog(`No chapters found for "${title}".`);
        continue;
      }

      addLog(`Chapters found for "${title}": ${chapters.length}`);

      // Compare current and found chapters
      const currentChaptersNum = item.media.numChapters || 0;
      const foundChaptersNum = chapters.length;
      addLog(`Current chapter count: ${currentChaptersNum}`);

      if (
        Math.abs(currentChaptersNum - foundChaptersNum) > chapterThreshold ||
        currentChaptersNum === 0
      ) {
        addLog(`Chapters are missing or incorrect for "${title}". Updating...`);

        const newChapters = createChaptersFromAsin(
          chapters,
          item.media.duration,
        );
        const success = await updateBookChapters(bookId, {
          chapters: newChapters,
        });

        if (success) {
          addLog(`Chapters updated successfully for "${title}".`);
          bookInfo[bookId].status = "FINISHED";
          bookInfo[bookId].comment = "Chapters updated";
        } else {
          addLog(`Error updating chapters for "${title}".`);
          bookInfo[bookId].comment = "Chapters update failed";
        }
      } else {
        bookInfo[bookId].status = "FINISHED";
        bookInfo[bookId].comment = "No chapters to update";
        addLog(`Chapters are fine for "${title}".`);
      }

      if (!disableRateProtection) {
        await delay(2000);
      }
    }

    addLog("\n--- Summary ---");
    for (const [_bookId, info] of Object.entries(bookInfo)) {
      addLog(`${info.title} (${info.status}): ${info.comment}`);
      addLog("-".repeat(50));
    }

    addLog("\n--- Failed Books ---");
    for (const [_bookId, info] of Object.entries(bookInfo)) {
      if (info.status !== "FINISHED") {
        addLog(`${info.title} (${info.status}): ${info.comment}`);
        addLog("-".repeat(50));
      }
    }

    return {
      success: true,
      message: "Audiobook chapters matching completed",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to match audiobook chapters",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
