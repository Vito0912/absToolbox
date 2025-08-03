import { useApi } from "@/composables/useApi";
import type { ToolResult } from "@/types/tool";
const { get, post } = useApi()

async function getAllBooksForSeries(seriesId: string, libraryId: string) {

  try {
    const base64SeriesId = btoa(unescape(encodeURIComponent(seriesId))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await get(`/api/libraries/${libraryId}/items?filter=series.${base64SeriesId}`)
    console.log(`Fetched ${response.data.results.length} books for series ${seriesId} in library ${libraryId}`)
    return response.data.results || []
  } catch (error) {
    console.error(`Error fetching books for series ${seriesId} in library ${libraryId}:`, error)
    return []
  }
}

export async function executeRenameSeries(formData: Record<string, any>): Promise<ToolResult> {
    const { libraryId, seriesId, newName } = formData;

    const seriesBooks = await getAllBooksForSeries(seriesId, libraryId);
    const books = (await post(`/api/items/batch/get`, { libraryItemIds: seriesBooks.map((book: any) => book.id) })).data.libraryItems;

    const payload = [];

    for (const book of books) {

        const oldSeries = book.media.metadata.series

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
                }
            }
        }
        payload.push(push);
    }

    await post('/api/items/batch/update', [...payload]);

    return {
        success: true,
        message: `Series renamed successfully.`,
        data: payload,
        timestamp: new Date().toISOString(),
    };
}