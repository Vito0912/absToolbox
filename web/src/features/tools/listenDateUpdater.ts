import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

const { get, patch, addLog } = useApi();

export async function executeListenDateUpdater(
  formData: Record<string, any>,
): Promise<ToolResult> {
  try {
    const { libraryItemIds, dateToSet } = formData;

    const newDate: Date = new Date(dateToSet);
    if (isNaN(newDate.getTime())) {
      throw new Error("Invalid date format");
    }

    addLog(
      `Setting listen date to ${newDate.toISOString()} for ${libraryItemIds.length} items`,
    );

    await patch(
      "/api/me/progress/batch/update",
      libraryItemIds.map((id: string) => ({
        libraryItemId: id,
        finishedAt: newDate.getTime(),
      })),
    );

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
