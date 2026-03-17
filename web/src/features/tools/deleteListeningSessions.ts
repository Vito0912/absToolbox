import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";

const { absClient, addLog } = useApi();

export async function executeDeleteListeningSessions(
  formData: Record<string, any>,
): Promise<ToolResult> {
  try {
    const { userIds = [], threshold, sessionsToFetch } = formData;

    let processableUsers = userIds;

    if (processableUsers.length === 0) {
      const users = (await absClient.users.list()).users || [];
      processableUsers = users.map((user: { id: string }) => user.id);
    }

    addLog(`Processing ${processableUsers.length} users`);

    for (const userId of processableUsers) {
      const sessions = await absClient.users.listeningSessionsForUser(userId, {
        itemsPerPage: sessionsToFetch,
      });
      const sessionsToDelete: [string, number][] = [];
      let sessionTimeNotDeleted = 0;
      let sessionTimeDeleted = 0;

      for (const session of sessions.sessions || []) {
        if (!session.timeListening) continue;

        const sessionDuration = session.timeListening / 3600;
        if (sessionDuration > threshold) {
          sessionTimeDeleted += sessionDuration;
          addLog(
            `Session greater than threshold: ${session.id} ${sessionDuration} hours`,
          );
          sessionsToDelete.push([session.id, sessionDuration]);
        } else {
          sessionTimeNotDeleted += sessionDuration;
        }
      }

      addLog(
        `User ${userId} has ${
          sessionsToDelete.length
        } sessions to delete with a total duration of ${sessionTimeDeleted.toFixed(
          2,
        )} hours. (${sessionTimeNotDeleted.toFixed(2)} hours not deleted)`,
      );

      for (const [sessionId, _duration] of sessionsToDelete) {
        try {
          await absClient.sessions.delete(sessionId);
          addLog(`Deleted session ${sessionId}`);
        } catch (error) {
          addLog(`Error deleting session ${sessionId}: ${error}`);
        }
      }

      addLog(" ");
    }

    return {
      success: true,
      message: "Listening sessions deleted successfully",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to delete listening sessions",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
