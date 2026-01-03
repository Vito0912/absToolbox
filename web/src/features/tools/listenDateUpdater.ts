import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

const { get, patch, del, addLog } = useApi();

export async function executeListenDateUpdater(
  formData: Record<string, any>,
): Promise<ToolResult> {
  try {
    const { libraryItemIds, startDate, finishedDate } = formData;

    const parseDateToUTC = (dateString: string): Date => {
      const yyyymmdd = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!yyyymmdd) {
        throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD.`);
      }
      
      const year = parseInt(yyyymmdd[1], 10);
      const month = parseInt(yyyymmdd[2], 10) - 1;
      const day = parseInt(yyyymmdd[3], 10);
      
      return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
    };

    const startDateObj = parseDateToUTC(startDate);
    const finishedDateObj = parseDateToUTC(finishedDate);

    addLog(
      `Setting listen dates - Started: ${startDateObj.toISOString()}, Finished: ${finishedDateObj.toISOString()} for ${libraryItemIds.length} items`,
    );

    // Delete existing progress first, then set new dates
    // Use single-item endpoint in a loop since createdAt doesn't work in batch endpoint
    for (const id of libraryItemIds) {
      // Get existing progress to extract its ID for deletion
      try {
        const progressResponse = await get(`/api/me/progress/${id}`);
        if (progressResponse.data?.id) {
          // Delete using the progress ID (not library item ID)
          await del(`/api/me/progress/${progressResponse.data.id}`);
          addLog(`Deleted existing progress for item ${id}`);
          // Wait a moment for delete to complete
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error: any) {
        // 404 means no progress exists, which is fine - continue to create new progress
        if (error.response?.status !== 404) {
          addLog(`Warning: Could not check/delete progress for item ${id}: ${error.message}`);
        }
      }

      // Set new progress with dates
      await patch(
        `/api/me/progress/${id}`,
        {
          createdAt: startDateObj.getTime(),
          finishedAt: finishedDateObj.getTime(),
          isFinished: true,
          progress: 1,
        },
      );
    }

    addLog("Listen dates updated successfully");

    return {
      success: true,
      message: "Listening state updated successfully",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update listening state",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
