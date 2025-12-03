export interface ListeningSession {
  id: string;
  userId?: string;
  libraryId?: string;
  libraryItemId: string;
  bookId?: string;
  episodeId?: string | null;
  mediaType?: "book" | "podcast";
  mediaMetadata?: {
    title?: string;
    subtitle?: string | null;
    authors?: { id?: string; name?: string }[];
    narrators?: string[];
    series?: { id?: string; name?: string; sequence?: string | null }[];
    genres?: string[];
    tags?: string[];
    publishedYear?: string | null;
    publishedDate?: string | null;
    publisher?: string | null;
    description?: string | null;
    isbn?: string | null;
    asin?: string | null;
    language?: string | null;
    explicit?: boolean;
    abridged?: boolean;
  } | null;
  displayTitle?: string;
  displayAuthor?: string;
  coverPath?: string | null;
  duration?: number;
  playMethod?: number;
  mediaPlayer?: string;
  deviceInfo?: {
    id?: string;
    userId?: string;
    deviceId?: string;
    ipAddress?: string;
    clientVersion?: string;
    manufacturer?: string;
    model?: string;
    sdkVersion?: string;
    clientName?: string;
    deviceName?: string;
  } | null;
  serverVersion?: string;
  date?: string;
  dayOfWeek?: string;
  timeListening: number;
  startTime?: number;
  currentTime?: number;
  startedAt: number;
  updatedAt?: number;
}

export interface LibraryItem {
  id: string;
  ino: string;
  libraryId: string;
  folderId: string;
  path: string;
  relPath: string;
  isFile: boolean;
  mediaType: "book" | "podcast";
  media: {
    id?: string;
    metadata: {
      title?: string;
      subtitle?: string;
      authors?: { id?: string; name?: string }[];
      narrators?: string[];
      series?: { id?: string; name?: string; sequence?: string }[];
      genres?: string[];
      tags?: string[];
      publishedYear?: string;
      publishedDate?: string;
      publisher?: string;
      description?: string;
      isbn?: string;
      asin?: string;
      language?: string;
      explicit?: boolean;
    };
    coverPath?: string | null;
    duration?: number;
  };
}

export interface MediaProgress {
  id: string;
  userId: string;
  libraryItemId: string;
  episodeId: string | null;
  mediaItemId: string;
  mediaItemType: "book" | "podcast";
  duration: number;
  progress: number;
  currentTime: number;
  isFinished: boolean;
  hideFromContinueListening: boolean;
  ebookLocation: string | null;
  ebookProgress: number | null;
  lastUpdate: number;
  startedAt: number;
  finishedAt: number | null;
}

export interface Bookmark {
  libraryItemId: string;
  title: string;
  time: number;
  createdAt: number;
}

export interface UserData {
  id: string;
  username: string;
  mediaProgress: MediaProgress[];
  bookmarks: Bookmark[];
}

export interface StatsConfig {
  startDate: string;
  endDate: string;
  fetchBookDetails: boolean;
  visibleSections: {
    totalListeningTime: boolean;
    totalSessions: boolean;
    finishedBooks: boolean;
    finishedPodcasts: boolean;
    finishedTotal: boolean;
    bookmarksCreated: boolean;
    dailyAverage: boolean;
    topGenres: boolean;
    topAuthors: boolean;
    topNarrators: boolean;
    topSeries: boolean;
    topTags: boolean;
    topBooks: boolean;
    mostActiveDay: boolean;
    mostActiveTime: boolean;
    medianSessionDuration: boolean;
    topDevices: boolean;
  };
  topItemsCount: number;
}

export interface ProcessedStats {
  totalListeningTime: number;
  totalSessions: number;
  finishedBooks: number;
  finishedPodcasts: number;
  finishedTotal: number;
  bookmarksCreated: number;
  dailyAverage: number;
  dailyAverageLast7: number;
  dailyAverageLast30: number;
  dailyAverageLast365: number;
  dailyAverageAllTime: number;
  topGenres: { name: string; time: number }[];
  topAuthors: { name: string; time: number }[];
  topNarrators: { name: string; time: number }[];
  topSeries: { name: string; time: number }[];
  topTags: { name: string; time: number }[];
  topBooks: {
    title: string;
    author: string;
    time: number;
    coverPath: string | null;
    libraryItemId: string;
  }[];
  mostActiveDay: { day: string; time: number };
  mostActiveTime: { hour: number; time: number };
  medianSessionDuration: number;
  topDevices: { name: string; os: string; count: number }[];
  dateRange: { start: string; end: string };
  hourData: Record<string, number>;
  dayData: Record<string, number>;
}

export const defaultStatsConfig: StatsConfig = {
  startDate: `${new Date().getFullYear()}-01-01`,
  endDate: new Date().toISOString().split("T")[0],
  fetchBookDetails: false,
  visibleSections: {
    totalListeningTime: true,
    totalSessions: true,
    finishedBooks: true,
    finishedPodcasts: true,
    finishedTotal: true,
    bookmarksCreated: true,
    dailyAverage: true,
    topGenres: true,
    topAuthors: true,
    topNarrators: true,
    topSeries: true,
    topTags: true,
    topBooks: true,
    mostActiveDay: true,
    mostActiveTime: true,
    medianSessionDuration: true,
    topDevices: true,
  },
  topItemsCount: 5,
};
