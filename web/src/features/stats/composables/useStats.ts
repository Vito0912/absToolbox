import { ref } from "vue";
import { useApi } from "@/shared/composables/useApi";
import type {
  ListeningSession,
  LibraryItem,
  UserData,
  ProcessedStats,
  StatsConfig,
} from "../types";
import { defaultStatsConfig } from "../types";

export function useStats() {
  const { get, post } = useApi();

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const userData = ref<UserData | null>(null);
  const sessions = ref<ListeningSession[]>([]);
  const libraryItems = ref<Map<string, LibraryItem>>(new Map());
  const config = ref<StatsConfig>({ ...defaultStatsConfig });
  const loadingProgress = ref({ current: 0, total: 0, status: "" });

  const loadUserData = async (): Promise<UserData> => {
    loadingProgress.value.status = "Loading user data...";
    const response = await get("/api/me");
    return response.data;
  };

  const loadAllSessions = async (
    userId: string
  ): Promise<ListeningSession[]> => {
    loadingProgress.value.status = "Loading listening sessions...";
    const response = await get(
      `/api/users/${userId}/listening-sessions?page=0&itemsPerPage=1000000`
    );
    return response.data.sessions || [];
  };

  const loadLibraryItemsBatch = async (
    libraryItemIds: string[]
  ): Promise<Map<string, LibraryItem>> => {
    const itemMap = new Map<string, LibraryItem>();
    const uniqueIds = [...new Set(libraryItemIds)];
    const batchSize = 100;

    for (let i = 0; i < uniqueIds.length; i += batchSize) {
      const batch = uniqueIds.slice(i, i + batchSize);
      loadingProgress.value.status = `Loading book details... (${Math.min(
        i + batchSize,
        uniqueIds.length
      )}/${uniqueIds.length})`;
      loadingProgress.value.current = Math.min(i + batchSize, uniqueIds.length);
      loadingProgress.value.total = uniqueIds.length;

      try {
        const response = await post("/api/items/batch/get", {
          libraryItemIds: batch,
        });

        const items = response.data?.libraryItems || [];
        for (const item of items) {
          if (item?.id) {
            itemMap.set(item.id, item);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch batch:", e);
      }
    }

    return itemMap;
  };

  const filterSessionsByDate = (
    allSessions: ListeningSession[],
    startDate: string,
    endDate: string
  ): ListeningSession[] => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    return allSessions.filter((session) => {
      const sessionDate = session.startedAt;
      return sessionDate >= start && sessionDate <= end;
    });
  };

  const processStats = async (
    allSessions: ListeningSession[],
    user: UserData,
    cfg: StatsConfig,
    items: Map<string, LibraryItem> = new Map()
  ): Promise<ProcessedStats> => {
    const filteredSessions = filterSessionsByDate(
      allSessions,
      cfg.startDate,
      cfg.endDate
    );

    const totalListeningTime = filteredSessions.reduce(
      (sum, s) => sum + s.timeListening,
      0
    );
    const totalSessions = filteredSessions.length;

    const startDate = new Date(cfg.startDate);
    const endDate = new Date(cfg.endDate);
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const dailyAverage = totalListeningTime / daysDiff;

    const now = Date.now();
    const last7Days = filterSessionsByDate(
      allSessions,
      new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );
    const last30Days = filterSessionsByDate(
      allSessions,
      new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );
    const last365Days = filterSessionsByDate(
      allSessions,
      new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );

    const dailyAverageLast7 =
      last7Days.reduce((sum, s) => sum + s.timeListening, 0) / 7;
    const dailyAverageLast30 =
      last30Days.reduce((sum, s) => sum + s.timeListening, 0) / 30;
    const dailyAverageLast365 =
      last365Days.reduce((sum, s) => sum + s.timeListening, 0) / 365;

    const allTimeStart = Math.min(...allSessions.map((s) => s.startedAt));
    const allTimeDays = Math.max(
      1,
      Math.ceil((now - allTimeStart) / (1000 * 60 * 60 * 24))
    );
    const dailyAverageAllTime =
      allSessions.reduce((sum, s) => sum + s.timeListening, 0) / allTimeDays;

    const dateRangeStart = new Date(cfg.startDate).getTime();
    const dateRangeEnd = new Date(cfg.endDate).setHours(23, 59, 59, 999);

    const finishedBooks = user.mediaProgress.filter((p) => {
      const isFinished = p.isFinished || p.progress >= 0.999;
      const isBook = p.episodeId === null;
      const inDateRange = p.finishedAt
        ? p.finishedAt >= dateRangeStart && p.finishedAt <= dateRangeEnd
        : p.lastUpdate >= dateRangeStart && p.lastUpdate <= dateRangeEnd;
      return isFinished && isBook && inDateRange;
    }).length;

    const finishedPodcasts = user.mediaProgress.filter((p) => {
      const isFinished = p.isFinished || p.progress >= 0.999;
      const isPodcastEpisode = p.episodeId !== null;
      const inDateRange = p.finishedAt
        ? p.finishedAt >= dateRangeStart && p.finishedAt <= dateRangeEnd
        : p.lastUpdate >= dateRangeStart && p.lastUpdate <= dateRangeEnd;
      return isFinished && isPodcastEpisode && inDateRange;
    }).length;

    const bookmarksCreated = user.bookmarks.filter(
      (b) => b.createdAt >= dateRangeStart && b.createdAt <= dateRangeEnd
    ).length;

    const genreMap = new Map<string, number>();
    const authorMap = new Map<string, number>();
    const narratorMap = new Map<string, number>();
    const seriesMap = new Map<string, number>();
    const tagMap = new Map<string, number>();
    const bookMap = new Map<
      string,
      {
        title: string;
        author: string;
        time: number;
        coverPath: string | null;
        libraryItemId: string;
      }
    >();
    const dayMap = new Map<string, number>();
    const hourMap = new Map<number, number>();
    const deviceMap = new Map<
      string,
      { name: string; os: string; count: number }
    >();

    for (const session of filteredSessions) {
      const libraryItem = items.get(session.libraryItemId);
      const bookMetadata = libraryItem?.media?.metadata;
      const metadata = session.mediaMetadata;

      const genres = bookMetadata?.genres || metadata?.genres || [];
      for (const genre of genres) {
        if (genre) {
          genreMap.set(
            genre,
            (genreMap.get(genre) || 0) + session.timeListening
          );
        }
      }

      const authors = bookMetadata?.authors || metadata?.authors || [];
      for (const author of authors) {
        if (author?.name) {
          authorMap.set(
            author.name,
            (authorMap.get(author.name) || 0) + session.timeListening
          );
        }
      }

      const narrators = bookMetadata?.narrators || metadata?.narrators || [];
      for (const narrator of narrators) {
        if (narrator) {
          narratorMap.set(
            narrator,
            (narratorMap.get(narrator) || 0) + session.timeListening
          );
        }
      }

      const series = bookMetadata?.series || metadata?.series || [];
      for (const s of series) {
        if (s?.name) {
          seriesMap.set(
            s.name,
            (seriesMap.get(s.name) || 0) + session.timeListening
          );
        }
      }

      const tags = bookMetadata?.tags || metadata?.tags || [];
      for (const tag of tags) {
        if (tag) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + session.timeListening);
        }
      }

      const bookKey = session.libraryItemId;
      if (bookKey) {
        const existing = bookMap.get(bookKey);
        if (existing) {
          existing.time += session.timeListening;
        } else {
          const isPodcast =
            session.mediaType === "podcast" ||
            libraryItem?.mediaType === "podcast";
          const title =
            bookMetadata?.title ||
            (isPodcast ? undefined : session.displayTitle) ||
            "Unknown";
          const authorNames = bookMetadata?.authors
            ?.map((a) => a.name)
            .filter(Boolean)
            .join(", ");
          const author = authorNames || session.displayAuthor || "Unknown";
          const coverPath =
            libraryItem?.media?.coverPath || session.coverPath || null;

          bookMap.set(bookKey, {
            title,
            author,
            time: session.timeListening,
            coverPath,
            libraryItemId: session.libraryItemId,
          });
        }
      }

      if (session.dayOfWeek) {
        dayMap.set(
          session.dayOfWeek,
          (dayMap.get(session.dayOfWeek) || 0) + session.timeListening
        );
      }

      const hour = new Date(session.startedAt).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + session.timeListening);

      if (session.deviceInfo) {
        const manufacturer = session.deviceInfo.manufacturer || "Unknown";
        const model = session.deviceInfo.model || "Device";
        const deviceKey = `${manufacturer} ${model}`;
        const existing = deviceMap.get(deviceKey);
        if (existing) {
          existing.count++;
        } else {
          deviceMap.set(deviceKey, {
            name: deviceKey,
            os: session.deviceInfo.clientName || "Unknown",
            count: 1,
          });
        }
      }
    }

    const sortByTime = <T extends { time: number }>(items: T[]): T[] =>
      items.sort((a, b) => b.time - a.time);

    const topGenres = sortByTime(
      Array.from(genreMap.entries()).map(([name, time]) => ({ name, time }))
    ).slice(0, cfg.topItemsCount);

    const topAuthors = sortByTime(
      Array.from(authorMap.entries()).map(([name, time]) => ({ name, time }))
    ).slice(0, cfg.topItemsCount);

    const topNarrators = sortByTime(
      Array.from(narratorMap.entries()).map(([name, time]) => ({ name, time }))
    ).slice(0, cfg.topItemsCount);

    const topSeries = sortByTime(
      Array.from(seriesMap.entries()).map(([name, time]) => ({ name, time }))
    ).slice(0, cfg.topItemsCount);

    const topTags = sortByTime(
      Array.from(tagMap.entries()).map(([name, time]) => ({ name, time }))
    ).slice(0, cfg.topItemsCount);

    const topBooks = sortByTime(Array.from(bookMap.values())).slice(
      0,
      cfg.topItemsCount
    );

    const sortedDays = Array.from(dayMap.entries()).sort((a, b) => b[1] - a[1]);
    const mostActiveDay = sortedDays[0]
      ? { day: sortedDays[0][0], time: sortedDays[0][1] }
      : { day: "N/A", time: 0 };

    const sortedHours = Array.from(hourMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const mostActiveTime = sortedHours[0]
      ? { hour: sortedHours[0][0], time: sortedHours[0][1] }
      : { hour: 0, time: 0 };

    const sessionDurations = filteredSessions
      .map((s) => s.timeListening)
      .sort((a, b) => a - b);
    const medianSessionDuration =
      sessionDurations.length > 0
        ? sessionDurations[Math.floor(sessionDurations.length / 2)]
        : 0;

    const topDevices = Array.from(deviceMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, cfg.topItemsCount);

    return {
      totalListeningTime,
      totalSessions,
      finishedBooks,
      finishedPodcasts,
      finishedTotal: finishedBooks + finishedPodcasts,
      bookmarksCreated,
      dailyAverage,
      dailyAverageLast7,
      dailyAverageLast30,
      dailyAverageLast365,
      dailyAverageAllTime,
      topGenres,
      topAuthors,
      topNarrators,
      topSeries,
      topTags,
      topBooks,
      mostActiveDay,
      mostActiveTime,
      medianSessionDuration,
      topDevices,
      dateRange: { start: cfg.startDate, end: cfg.endDate },
      hourData: Object.fromEntries(hourMap),
      dayData: Object.fromEntries(dayMap),
    };
  };

  const loadStats = async (): Promise<ProcessedStats | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      userData.value = await loadUserData();
      sessions.value = await loadAllSessions(userData.value.id);

      if (config.value.fetchBookDetails) {
        const libraryItemIds = [
          ...new Set(sessions.value.map((s) => s.libraryItemId)),
        ];
        libraryItems.value = await loadLibraryItemsBatch(libraryItemIds);
      } else {
        libraryItems.value = new Map();
      }

      loadingProgress.value.status = "Processing statistics...";
      const stats = await processStats(
        sessions.value,
        userData.value,
        config.value,
        libraryItems.value
      );

      return stats;
    } catch (e: any) {
      error.value = e.message || "Failed to load statistics";
      return null;
    } finally {
      isLoading.value = false;
      loadingProgress.value.status = "";
    }
  };

  const updateConfig = (newConfig: Partial<StatsConfig>) => {
    config.value = { ...config.value, ...newConfig };
  };

  return {
    isLoading,
    error,
    config,
    loadingProgress,
    loadStats,
    updateConfig,
    processStats,
    sessions,
    userData,
    libraryItems,
  };
}
