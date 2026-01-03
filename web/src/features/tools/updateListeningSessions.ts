import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

const { get, post, del, addLog } = useApi();

interface Session {
  id: string;
  userId: string;
  libraryId: string;
  libraryItemId: string;
  timeListening: number;
  startTime: number;
  currentTime: number;
  startedAt: number;
  updatedAt: number;
}

interface SessionsResponse {
  total: number;
  numPages: number;
  page: number;
  itemsPerPage: number;
  sessions: Session[];
}

export async function executeUpdateListeningSessions(
  formData: Record<string, any>
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
  page: number = 0
): Promise<SessionsResponse> {
  const response = await get(
    `/api/users/${userId}/listening-sessions?page=${page}&itemsPerPage=10`
  );
  return response.data;
}

export async function updateSession(session: Session): Promise<void> {
  await del(`/api/sessions/${session.id}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await post(`/api/session/local`, session);
}
