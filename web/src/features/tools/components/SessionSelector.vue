<template>
  <div class="space-y-3">
    <div v-if="loading" class="text-sm text-gray-400">
      Loading users...
    </div>
    <div v-else-if="error" class="text-sm text-rose-400">
      Error loading users: {{ error }}
    </div>
    <div v-else>
      <label class="block text-sm font-medium text-gray-200 mb-2">Choose User</label>
      <select
        v-model="selectedUserId"
        @change="loadSessions"
        class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="">-- Select a user --</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.username }}
        </option>
      </select>

      <div v-if="selectedUserId" class="mt-4 space-y-3">
        <div v-if="sessionsLoading" class="text-sm text-gray-400">
          Loading sessions...
        </div>
        <div v-else-if="sessionsError" class="text-sm text-rose-400">
          Error loading sessions: {{ sessionsError }}
        </div>
        <div v-else-if="sessions.length === 0" class="text-sm text-gray-400">
          No sessions found for this user.
        </div>
        <div v-else>
          <div class="space-y-2 mb-3">
            <div
              v-for="(session, _index) in sessions"
              :key="session.id"
              @click="openEditModal(session)"
              class="p-3 rounded-lg border border-white/10 bg-gray-900/40 hover:bg-gray-800/60 transition cursor-pointer"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-200">
                    {{ session.mediaMetadata.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ formatDate(session.updatedAt) }} • {{ formatTime(session.timeListening) }}
                  </div>
                </div>
                <button
                  type="button"
                  class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              type="button"
              @click="previousPage"
              :disabled="currentPage === 0"
              class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-xs text-gray-400">
              Page {{ currentPage + 1 }} of {{ totalPages }}
            </span>
            <button
              type="button"
              @click="nextPage"
              :disabled="currentPage >= totalPages - 1"
              class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-gray-900 border border-white/10 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-200 mb-4">Edit Listening Session</h3>
        
        <div v-if="editingSession" class="space-y-4">
          <div>
            <div class="text-sm font-medium text-gray-300 mb-1">Title</div>
            <div class="text-sm text-gray-400">{{ editingSession.mediaMetadata.title }}</div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-300 mb-1">Current Listening Time</div>
            <div class="text-sm text-gray-400">{{ formatTime(editingSession.timeListening) }}</div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-300 mb-1">Start Time</div>
            <div class="text-sm text-gray-400">{{ formatTime(editingSession.startTime) }}</div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-300 mb-1">End Time</div>
            <div class="text-sm text-gray-400">{{ formatTime(editingSession.currentTime) }}</div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-300 mb-1">Suggested Time (hours)</div>
            <div class="text-sm text-gray-400">{{ suggestedTime.toFixed(3) }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              New Listening Time (hours)
            </label>
            <input
              v-model.number="newListeningTime"
              type="number"
              step="0.001"
              class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              @click="saveSession"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
            >
              Update Session
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/shared/composables/useApi";
import { fetchUserSessions, updateSession } from "../updateListeningSessions";

const { get, addLog } = useApi();

const users = ref<Array<{ id: string; username: string }>>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedUserId = ref("");

const sessions = ref<any[]>([]);
const sessionsLoading = ref(false);
const sessionsError = ref<string | null>(null);
const currentPage = ref(0);
const totalPages = ref(0);

const showModal = ref(false);
const editingSession = ref<any | null>(null);
const newListeningTime = ref(0);

const suggestedTime = computed(() => {
  if (!editingSession.value) return 0;
  return (editingSession.value.currentTime - editingSession.value.startTime) / 3600;
});

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await get("/api/users");
    users.value = response.data.users || [];
  } catch (err: any) {
    error.value = err.message || "Failed to load users";
  } finally {
    loading.value = false;
  }
};

const loadSessions = async () => {
  if (!selectedUserId.value) return;
  
  try {
    sessionsLoading.value = true;
    sessionsError.value = null;
    const data = await fetchUserSessions(selectedUserId.value, currentPage.value);
    sessions.value = data.sessions || [];
    totalPages.value = data.numPages || 1;
  } catch (err: any) {
    sessionsError.value = err.message || "Failed to load sessions";
  } finally {
    sessionsLoading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    loadSessions();
  }
};

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadSessions();
  }
};

const openEditModal = (session: any) => {
  editingSession.value = { ...session };
  newListeningTime.value = suggestedTime.value;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingSession.value = null;
  newListeningTime.value = 0;
};

const saveSession = async () => {
  if (!editingSession.value) return;
  
  try {
    const updatedSession = {
      ...editingSession.value,
      timeListening: newListeningTime.value * 3600
    };
    
    addLog(`Updating session ${updatedSession.id} with new listening time: ${formatTime(updatedSession.timeListening)}`);
    await updateSession(updatedSession);
    addLog(`Session ${updatedSession.id} updated successfully`);
    
    closeModal();
    await loadSessions();
  } catch (err: any) {
    addLog(`Error updating session: ${err.message}`);
  }
};

onMounted(() => {
  loadUsers();
});
</script>
