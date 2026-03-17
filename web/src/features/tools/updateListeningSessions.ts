import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";
import {
  AbsSessionLocalSyncRequest,
  AbsSessionsResponse,
} from "@vito0912/abs-ts-sdk/types";

const { absClient, addLog } = useApi();

export async function executeUpdateListeningSessions(
  formData: Record<string, any>,
): Promise<ToolResult> {
  try {
    const { userId } = formData;

    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
        timestamp: new Date().toISOString(),
      };
    }

    addLog(`Tool completed - session selector handled in component`);

    return {
      success: true,
      message: "Session updates completed",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update listening sessions",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchUserSessions(
  userId: string,
  page: number = 0,
): Promise<AbsSessionsResponse> {
  return await absClient.sessions.list({
    page: page,
    user: userId,
    desc: true,
  });
}

export async function updateSession(
  session: AbsSessionLocalSyncRequest,
): Promise<void> {
  await absClient.sessions.delete(session.id);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await absClient.sessions.syncLocal(session);
}
