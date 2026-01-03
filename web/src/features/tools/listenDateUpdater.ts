import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

const { get, patch, del, addLog } = useApi();

export async function executeListenDateUpdater(
  formData: Record<string, any>
): Promise<ToolResult> {
  try {
    const { libraryItemIds, startDate, finishedDate, useLastListenDate } =
      formData;

    const parseDateToUTC = (dateString: string): Date => {
      const yyyymmdd = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!yyyymmdd) {
        throw new Error(
          `Invalid date format: ${dateString}. Expected YYYY-MM-DD.`
        );
      }

      const year = parseInt(yyyymmdd[1], 10);
      const month = parseInt(yyyymmdd[2], 10) - 1;
      const day = parseInt(yyyymmdd[3], 10);

      return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
    };

    let finishedDateObj: Date;
    if (!useLastListenDate && !finishedDate) {
      finishedDateObj = new Date();
      addLog(
        "No finished date provided and not using last listen date - using current date"
      );
    } else if (finishedDate && !useLastListenDate) {
      finishedDateObj = parseDateToUTC(finishedDate);
    } else {
      finishedDateObj = new Date();
    }

    let startDateObj: Date | null = null;
    if (startDate) {
      startDateObj = parseDateToUTC(startDate);
      addLog(
        `Setting listen dates - Started: ${startDateObj.toISOString()} for ${
          libraryItemIds.length
        } items`
      );
    } else {
      addLog(
        `No start date provided - will use existing progress start date or finished date for ${libraryItemIds.length} items`
      );
    }

    if (useLastListenDate) {
      addLog("Using last listening session date for finished date");
    } else if (finishedDate || !useLastListenDate) {
      addLog(`Finished: ${finishedDateObj.toISOString()}`);
    }

    // Delete existing progress first, then set new dates
    // Use single-item endpoint in a loop since createdAt doesn't work in batch endpoint
    for (const id of libraryItemIds) {
      let itemFinishedDate = finishedDateObj;
      let itemStartDate = startDateObj;

      if (useLastListenDate) {
        try {
          addLog(`Fetching listening sessions for item ${id}...`);
          const sessionsResponse = await get(
            `/api/me/item/listening-sessions/${id}/null?page=0&itemsPerPage=1`
          );

          if (
            sessionsResponse.data?.sessions &&
            sessionsResponse.data.sessions.length > 0
          ) {
            const lastSession = sessionsResponse.data.sessions[0];
            const lastListenTimestamp = lastSession.updatedAt;
            itemFinishedDate = new Date(lastListenTimestamp);

            const lastListenDateString = itemFinishedDate.toISOString();
            addLog(`Last listen date for item ${id}: ${lastListenDateString}`);
            addLog(
              `  Session updated at: ${lastListenTimestamp} (${new Date(
                lastListenTimestamp
              ).toLocaleString()})`
            );
          } else {
            addLog(
              `Warning: No listening sessions found for item ${id}, using fallback date`
            );
          }
        } catch (error: any) {
          addLog(
            `Warning: Could not fetch listening sessions for item ${id}: ${error.message}`
          );
          addLog(`Using fallback finished date for item ${id}`);
        }
      }

      // Get existing progress to determine start date (if not provided) and for deletion
      let existingProgressStartDate: Date | null = null;
      try {
        const progressResponse = await get(`/api/me/progress/${id}`);
        if (progressResponse.data?.id) {
          if (progressResponse.data.startedAt) {
            existingProgressStartDate = new Date(
              progressResponse.data.startedAt
            );
            addLog(
              `Found existing progress with start date for item ${id}: ${existingProgressStartDate.toISOString()}`
            );
          }
          // Delete using the progress ID (not library item ID)
          await del(`/api/me/progress/${progressResponse.data.id}`);
          addLog(`Deleted existing progress for item ${id}`);
          // Wait a moment for delete to complete
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error: any) {
        // 404 means no progress exists, which is fine - continue to create new progress
        if (error.response?.status !== 404) {
          addLog(
            `Warning: Could not check/delete progress for item ${id}: ${error.message}`
          );
        }
      }

      if (!itemStartDate) {
        if (existingProgressStartDate) {
          itemStartDate = existingProgressStartDate;
          addLog(
            `Using existing progress start date for item ${id}: ${itemStartDate.toISOString()}`
          );
        } else {
          itemStartDate = itemFinishedDate;
          addLog(
            `No existing progress found, using finished date as start date for item ${id}: ${itemStartDate.toISOString()}`
          );
        }
      }

      // Set new progress with dates
      await patch(`/api/me/progress/${id}`, {
        createdAt: itemStartDate.getTime(),
        finishedAt: itemFinishedDate.getTime(),
        isFinished: true,
        progress: 1,
      });
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
