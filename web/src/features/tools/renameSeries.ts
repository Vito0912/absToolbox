import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";
import { AbsLibraryItemMinified } from "@vito0912/abs-ts-sdk/types";

const { absClient, addLog } = useApi();

async function getAllBooksForSeries(
  seriesId: string,
  libraryId: string,
): Promise<AbsLibraryItemMinified[]> {
  try {
    const response = await absClient.libraries.listItems(libraryId, {
      filter: {
        group: "series",
        value: seriesId,
      },
    });
    console.log(
      `Fetched ${response.results.length} books for series ${seriesId} in library ${libraryId}`,
    );
    return response.results || [];
  } catch (error) {
    console.error(
      `Error fetching books for series ${seriesId} in library ${libraryId}:`,
      error,
    );
    return [];
  }
}

export async function executeRenameSeries(
  formData: Record<string, any>,
): Promise<ToolResult> {
  const { libraryId, seriesId, newName } = formData;

  const seriesBooks = await getAllBooksForSeries(seriesId, libraryId);
  const books = (
    await absClient.libraryItems.batchGet({
      libraryItemIds: seriesBooks.map((book: any) => book.id),
    })
  ).libraryItems;

  const payload = [];

  for (const book of books) {
    const oldSeries = book.media.metadata.series;
    if (!oldSeries) continue;

    for (const series of oldSeries) {
      if (series.id === seriesId) {
        series.name = newName;
      }
    }

    const push = {
      id: book.id,
      mediaPayload: {
        metadata: {
          series: oldSeries,
        },
      },
    };
    payload.push(push);
  }

  await absClient.libraryItems.batchUpdate(payload);

  addLog(`Renamed series to "${newName}" for ${payload.length} books`);

  return {
    success: true,
    message: `Series renamed successfully.`,
    timestamp: new Date().toISOString(),
  };
}
