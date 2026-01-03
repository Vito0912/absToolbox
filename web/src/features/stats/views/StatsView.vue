<template>
  <div class="space-y-6">
    <PageHeader
      title="Listening Stats"
      subtitle="Analyze your Audiobookshelf listening statistics"
    />

    <InfoBox v-if="!isConfigured" variant="warning">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-amber-100">Configuration Required</p>
          <p class="mt-1 text-sm text-amber-200/80">
            Please configure your Audiobookshelf server connection to view your statistics.
          </p>
        </div>
        <router-link
          to="/settings"
          class="shrink-0 ml-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          Go to Settings
        </router-link>
      </div>
    </InfoBox>

    <template v-else>
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex gap-2">
          <button
            @click="showConfig = !showConfig"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-white/10 transition-all hover:bg-gray-800 hover:ring-white/20"
          >
            <SlidersHorizontal
              class="h-4 w-4 text-gray-400"
              :class="{ 'rotate-90': showConfig }"
            />
            {{ showConfig ? "Hide" : "Show" }} Configuration
          </button>

          <button
            v-if="stats && firstSessionDate"
            @click="setAllTimeRange"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-white/10 transition-all hover:bg-gray-800 hover:ring-white/20"
          >
            <Calendar class="h-4 w-4 text-gray-400" />
            All Time
          </button>
        </div>

        <button
          @click="loadData"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
          <RefreshCw v-else class="h-4 w-4" />
          {{ isLoading ? "Loading..." : "Load Stats" }}
        </button>
      </div>

      <div v-if="showConfig">
        <StatsConfigComponent
          :config="config"
          @update:config="handleConfigUpdate"
        />
      </div>

      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-16"
      >
        <div
          class="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500"
        />
        <p class="mt-4 text-sm font-medium text-gray-300">
          {{ loadingProgress.status || "Loading..." }}
        </p>
        <p v-if="loadingProgress.total > 0" class="mt-1 text-xs text-gray-500">
          {{ loadingProgress.current }} / {{ loadingProgress.total }}
        </p>
      </div>

      <div v-else-if="error" class="mx-auto max-w-lg">
        <div
          class="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center"
        >
          <div
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-red-500/20"
          >
            <AlertCircle class="h-6 w-6 text-red-400" />
          </div>
          <h3 class="text-lg font-semibold text-white">Error Loading Stats</h3>
          <p class="mt-2 text-sm text-gray-400">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="stats" class="space-y-6">
        <div
          v-if="allTimeStats"
          class="rounded-xl border border-white/10 bg-gray-900/40 p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-white">All Time Overview</h3>
            <span v-if="firstSessionDate" class="text-xs text-gray-500"
              >{{ formatDate(firstSessionDate) }} -
              {{ formatDate(new Date().toISOString().split("T")[0]) }}</span
            >
          </div>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div
              class="rounded-lg bg-gray-800/30 p-3 text-center ring-1 ring-white/5"
            >
              <p class="text-lg font-bold text-white">
                {{ formatDuration(allTimeStats.totalListeningTime) }}
              </p>
              <p class="text-xs text-gray-500">Total Time</p>
            </div>
            <div
              class="rounded-lg bg-gray-800/30 p-3 text-center ring-1 ring-white/5"
            >
              <p class="text-lg font-bold text-white">
                {{ allTimeStats.totalSessions.toLocaleString() }}
              </p>
              <p class="text-xs text-gray-500">Sessions</p>
            </div>
            <div
              class="rounded-lg bg-gray-800/30 p-3 text-center ring-1 ring-white/5"
            >
              <p class="text-lg font-bold text-white">
                {{ allTimeStats.finishedBooks }}
              </p>
              <p class="text-xs text-gray-500">Books</p>
            </div>
            <div
              class="rounded-lg bg-gray-800/30 p-3 text-center ring-1 ring-white/5"
            >
              <p class="text-lg font-bold text-white">
                {{ allTimeStats.finishedPodcasts }}
              </p>
              <p class="text-xs text-gray-500">Episodes</p>
            </div>
            <div
              class="rounded-lg bg-gray-800/30 p-3 text-center ring-1 ring-white/5 sm:col-span-1 col-span-2"
            >
              <p class="text-lg font-bold text-white">
                {{ allTimeStats.finishedTotal }}
              </p>
              <p class="text-xs text-gray-500">Total Finished</p>
            </div>
          </div>
        </div>

        <div
          v-if="hasVisiblePrimaryStats"
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            v-if="config.visibleSections.totalListeningTime"
            label="Listening Time "
            :value="formatDuration(stats.totalListeningTime)"
            :description="`${config.startDate} to ${config.endDate}`"
          >
            <template #icon>
              <Clock class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.totalSessions"
            label="Sessions "
            :value="stats.totalSessions.toLocaleString()"
            :description="`${config.startDate} to ${config.endDate}`"
          >
            <template #icon>
              <Music class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.finishedBooks"
            label="Finished Books "
            :value="stats.finishedBooks.toString()"
            :description="`${config.startDate} to ${config.endDate}`"
          >
            <template #icon>
              <BookOpen class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.finishedPodcasts"
            label="Finished Episodes "
            :value="stats.finishedPodcasts.toString()"
            :description="`${config.startDate} to ${config.endDate}`"
          >
            <template #icon>
              <Mic class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.finishedTotal"
            label="Total Finished "
            :value="stats.finishedTotal.toString()"
            :description="`${config.startDate} to ${config.endDate}`"
          >
            <template #icon>
              <CheckCircle class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.bookmarksCreated"
            label="Bookmarks Created"
            :value="stats.bookmarksCreated.toString()"
          >
            <template #icon>
              <Bookmark class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.medianSessionDuration"
            label="Median Session"
            :value="formatTime(stats.medianSessionDuration)"
          >
            <template #icon>
              <Zap class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>

          <StatCard
            v-if="config.visibleSections.dailyAverage"
            label="Daily Avg "
            :value="formatTime(stats.dailyAverage)"
            :description="`${config.startDate} to ${config.endDate}`"
          >
            <template #icon>
              <BarChart3 class="h-5 w-5 text-blue-400" />
            </template>
          </StatCard>
        </div>

        <DailyAverages
          v-if="config.visibleSections.dailyAverage"
          :last7="stats.dailyAverageLast7"
          :last30="stats.dailyAverageLast30"
          :last365="stats.dailyAverageLast365"
          :all-time="stats.dailyAverageAllTime"
        />

        <div class="grid gap-4 lg:grid-cols-2">
          <TopList
            v-if="config.visibleSections.topGenres"
            title="Top Genres"
            :items="stats.topGenres"
          />
          <TopList
            v-if="config.visibleSections.topAuthors"
            title="Top Authors"
            :items="stats.topAuthors"
          />
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <TopList
            v-if="config.visibleSections.topNarrators"
            title="Top Narrators"
            :items="stats.topNarrators"
          />
          <TopList
            v-if="config.visibleSections.topSeries"
            title="Top Series"
            :items="stats.topSeries"
          />
        </div>

        <TopList
          v-if="config.visibleSections.topTags && stats.topTags.length > 0"
          title="Top Tags"
          :items="stats.topTags"
        />

        <TopBooks
          v-if="config.visibleSections.topBooks"
          title="Most Listened"
          :books="stats.topBooks"
        />

        <div class="grid gap-4 lg:grid-cols-2">
          <DayOfWeekChart
            v-if="config.visibleSections.mostActiveDay"
            :day-data="stats.dayData"
            :peak-day="stats.mostActiveDay.day"
          />
          <TimeOfDayChart
            v-if="config.visibleSections.mostActiveTime"
            :hour-data="stats.hourData"
            :peak-hour="stats.mostActiveTime.hour"
          />
        </div>

        <DeviceList
          v-if="config.visibleSections.topDevices"
          :devices="stats.topDevices"
        />
      </div>

      <div v-else class="mx-auto max-w-lg">
        <div
          class="rounded-xl border border-white/10 bg-gray-900/40 p-6 text-center"
        >
          <div
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800/50 ring-1 ring-white/10"
          >
            <BarChart3 class="h-6 w-6 text-gray-500" />
          </div>
          <h3 class="text-lg font-semibold text-white">No Stats Loaded</h3>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useSettingsStore } from "@/shared/settings";
import { useStats } from "../composables/useStats";
import type { ProcessedStats, StatsConfig } from "../types";
import {
  StatCard,
  TopList,
  TopBooks,
  DailyAverages,
  TimeOfDayChart,
  DayOfWeekChart,
  DeviceList,
  StatsConfig as StatsConfigComponent,
} from "../components";
import { PageHeader, InfoBox } from "@/shared/components";
import {
  SlidersHorizontal,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock,
  Music,
  BookOpen,
  Mic,
  CheckCircle,
  Bookmark,
  Zap,
  BarChart3,
} from "lucide-vue-next";

const settingsStore = useSettingsStore();
const {
  isLoading,
  error,
  config,
  loadingProgress,
  loadStats,
  sessions,
  libraryItems,
  userData,
} = useStats();

const stats = ref<ProcessedStats | null>(null);
const showConfig = ref(false);

const isConfigured = computed(() => {
  return (
    !!settingsStore.settings.serverUrl && !!settingsStore.settings.apiToken
  );
});

const firstSessionDate = computed(() => {
  if (!sessions.value?.length) return null;
  const earliest = Math.min(...sessions.value.map((s) => s.startedAt));
  return new Date(earliest).toISOString().split("T")[0];
});

const allTimeStats = computed(() => {
  if (!stats.value || !sessions.value?.length || !userData.value) return null;

  const totalListeningTime = sessions.value.reduce(
    (sum, s) => sum + (s.timeListening || 0),
    0,
  );
  const totalSessions = sessions.value.length;

  const finishedBooks = userData.value.mediaProgress.filter((p) => {
    const isFinished = p.isFinished || p.progress >= 0.999;
    const isBook = p.episodeId === null;
    return isFinished && isBook;
  }).length;

  const finishedPodcasts = userData.value.mediaProgress.filter((p) => {
    const isFinished = p.isFinished || p.progress >= 0.999;
    const isPodcastEpisode = p.episodeId !== null;
    return isFinished && isPodcastEpisode;
  }).length;

  return {
    totalListeningTime,
    totalSessions,
    finishedBooks,
    finishedPodcasts,
    finishedTotal: finishedBooks + finishedPodcasts,
  };
});

const hasVisiblePrimaryStats = computed(() => {
  const { visibleSections } = config.value;
  return (
    visibleSections.totalListeningTime ||
    visibleSections.totalSessions ||
    visibleSections.finishedBooks ||
    visibleSections.finishedPodcasts ||
    visibleSections.finishedTotal ||
    visibleSections.bookmarksCreated ||
    visibleSections.medianSessionDuration ||
    visibleSections.dailyAverage
  );
});

const loadData = async () => {
  const result = await loadStats();
  if (result) {
    stats.value = result;
  }
};

const setAllTimeRange = async () => {
  if (!firstSessionDate.value) return;
  const newConfig: StatsConfig = {
    ...config.value,
    startDate: firstSessionDate.value,
    endDate: new Date().toISOString().split("T")[0],
  };
  await handleConfigUpdate(newConfig);
};

const handleConfigUpdate = async (newConfig: StatsConfig) => {
  config.value = newConfig;
  if (stats.value) {
    const { processStats } = useStats();
    if (userData.value && sessions.value?.length) {
      stats.value = await processStats(
        sessions.value,
        userData.value,
        newConfig,
        libraryItems.value,
      );
    }
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  return `${hours}h ${minutes}m`;
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
</script>
