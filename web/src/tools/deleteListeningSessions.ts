import { useApi } from '@/composables/useApi'
import type { ToolResult } from '@/types/tool'

const { get, apiClient, addLog } = useApi()

async function getAllUsers() {
  try {
    const response = await get('/api/users')
    return response.data.users || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

async function getListeningSessions(userId: string, itemsPerPage: number) {
  try {
    const response = await get(`/api/users/${userId}/listening-sessions?itemsPerPage=${itemsPerPage}`)
    return response.data.sessions || []
  } catch (error) {
    console.error(`Error fetching sessions for user ${userId}:`, error)
    return []
  }
}

async function deleteSession(sessionId: string) {
  try {
    await apiClient.value.delete(`/api/sessions/${sessionId}`)
    return true
  } catch (error) {
    console.error(`Error deleting session ${sessionId}:`, error)
    return false
  }
}

export async function executeDeleteListeningSessions(formData: Record<string, any>): Promise<ToolResult> {
  try {
    const {
      userIds = [],
      threshold,
      sessionsToFetch
    } = formData

    let processableUsers = userIds

    if (processableUsers.length === 0) {
      const users = await getAllUsers()
      processableUsers = users.map((user: { id: string }) => user.id)
    }

    addLog(`Processing ${processableUsers.length} users`)

    for (const userId of processableUsers) {
      const sessions = await getListeningSessions(userId, sessionsToFetch)
      const sessionsToDelete = []
      let sessionTimeNotDeleted = 0
      let sessionTimeDeleted = 0

      for (const session of sessions) {
        if (!session.timeListening) continue

        const sessionDuration = session.timeListening / 3600
        if (sessionDuration > threshold) {
          sessionTimeDeleted += sessionDuration
          addLog(`Session greater than threshold: ${session.id} ${sessionDuration} hours`)
          sessionsToDelete.push([session.id, sessionDuration])
        } else {
          sessionTimeNotDeleted += sessionDuration
        }
      }

      addLog(
        `User ${userId} has ${sessionsToDelete.length} sessions to delete with a total duration of ${sessionTimeDeleted.toFixed(2)} hours. (${sessionTimeNotDeleted.toFixed(2)} hours not deleted)`
      )

      for (const [sessionId, duration] of sessionsToDelete) {
        const success = await deleteSession(sessionId)
        if (success) {
          addLog(`Deleted session ${sessionId}`)
        } else {
          addLog(`Error deleting session ${sessionId}`)
        }
      }

      addLog(' ')
    }

    return {
      success: true,
      message: 'Listening sessions deleted successfully',
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to delete listening sessions',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}
