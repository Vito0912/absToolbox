import type { ToolDefinition } from "@/types/tool";
import { executeSplitGenres } from "@/tools/splitGenres";
import { executeDeleteListeningSessions } from "@/tools/deleteListeningSessions";
import { executeMatchAudiobookChapters } from "@/tools/quickMatchChapters";
import { executeRemoveEmptyAuthors } from "@/tools/removeEmptyAuthors";
import { executeForceMetadata } from "@/tools/forceMetadata";
import { executeRenameSeries } from "@/tools/renameSeries";

export const toolDefinitions: ToolDefinition[] = [
  {
    id: "split-genres",
    title: "Split Genres",
    description:
      "Separate combined genres into individual entries throughout your library.",
    longDescription:
     "Please specify genres/tags you want to skip. This is case-sensitive. Then select a delimiter to split the genres/tags. The original genres/tags will be removed, and the new ones (splitted) will be added to the books.",
    fields: [
      {
        name: "libraryIds",
        description:
          "Select libraries to process. If left empty, all libraries will be included.",
        type: "stringArray",
        label: "Library IDs (UUID)",
        required: false,
      },
      {
        name: "skip",
        type: "stringArray",
        label: "Skip Genres/Tags",
        required: true,
        default: ["Mystery, Thriller & Suspense"],
      },
      {
        name: "type",
        type: "select",
        label: "Type",
        required: true,
        options: ["genres", "tags"],
        default: "genres",
      },
      {
        name: "delimiter",
        type: "select",
        label: "Delimiter",
        required: true,
        options: [",", ";", "|", "&"],
        default: ",",
      },
    ],
    execute: executeSplitGenres,
  },
  {
    id: "delete-listening-sessions",
    title: "Delete Large Listening Sessions",
    description:
      "Deletes all listening sessions that exceed a specified duration.",
    fields: [
      {
        name: "userIds",
        type: "stringArray",
        label: "User IDs",
        description:
          "Select users to process. If left empty, all users will be included.",
        required: false,
      },
      {
        name: "threshold",
        type: "string",
        label: "Threshold (hours)",
        description: "Sessions longer than this duration will be deleted.",
        required: true,
        default: "24",
      },
      {
        name: "sessionsToFetch",
        type: "string",
        label: "Sessions to Fetch",
        description: "Number of sessions to retrieve per user.",
        required: true,
        default: "2000000",
      },
    ],
    execute: executeDeleteListeningSessions,
  },
  {
    id: "match-audiobook-chapters",
    title: "Match Audiobook Chapters",
    description:
      "Automatically matches chapters for audiobooks using the AudiobookShelf API.",
    longDescription: "Automatically matches chapters for audiobooks using the AudiobookShelf API. If chapters have been manually added to a book, they may be overwritten.",
    fields: [
      {
        name: "libraryId",
        type: "string",
        label: "Library ID",
        description: "The UUID of the library to process.",
        required: true,
      },
      {
        name: "chapterThreshold",
        type: "string",
        label: "Chapter Threshold",
        description:
          "Threshold for identifying missing chapters. Set to 99999999 to prevent overwriting existing chapters.",
        required: true,
        default: "3",
      },
      {
        name: "provider",
        type: "select",
        label: "Metadata Provider",
        description: "Select the metadata provider for searching.",
        required: true,
        options: [
          "audible.com",
          "audible.ca",
          "audible.co.uk",
          "audible.com.au",
          "audible.fr",
          "audible.de",
          "audible.co.jp",
          "audible.it",
          "audible.co.in",
          "audible.es",
        ],
        default: "audible.com",
      },
      {
        name: "region",
        type: "select",
        label: "Region Code",
        description: "Select the region code for chapter search.",
        required: true,
        options: ["US", "CA", "UK", "AU", "FR", "DE", "JP", "IT", "IN", "ES"],
        default: "US",
      },
      {
        name: "searchForAsin",
        type: "boolean",
        label: "Search for ASIN",
        description:
          "Search for ASIN if not available. Disable to use tracks as chapters if no ASIN is found.",
        required: true,
        default: true,
      },
      {
        name: "useTracksAsChapters",
        type: "boolean",
        label: "Use Tracks as Chapters",
        description: "Use tracks as chapters if no ASIN is available (fallback).",
        required: true,
        default: false,
      },
      {
        name: "disableRateProtection",
        type: "boolean",
        label: "Disable Rate Protection",
        description:
          "Disable rate protection to speed up processing, but this may cause timeouts.",
        required: true,
        default: false,
      },
    ],
    execute: executeMatchAudiobookChapters,
  },
  {
    id: "delete-orphaned-authors",
    title: "Remove Empty Authors",
    description:
      "Removes all authors who do not have any books associated with them in your libraries.",
    fields: [
      {
        name: "libraryIds",
        type: "stringArray",
        label: "Library IDs (UUID)",
        description:
          "Select specific libraries to process. If left empty, all libraries will be included.",
        required: false,
      },
    ],
    execute: executeRemoveEmptyAuthors,
  },
  {
    id: "force-metadata",
    title: "Force Metadata",
    description:
      "Adds a tag to all books in the selected library to force a metadata refresh on the next load.",
    fields: [
      {
        name: "libraryIds",
        type: "stringArray",
        label: "Library IDs",
        description:
          "Select libraries to process. If left empty, all libraries will be included.",
        required: true,
      },
    ],
    execute: executeForceMetadata,
  },
  {
    id: "rename-series",
    title: "Rename Series",
    description:
      "Renames a book series in the selected library.",
    fields: [
      {
        name: "libraryId",
        type: "string",
        label: "Library ID",
        description: "The UUID of the library.",
        required: true,
      },
      {
        name: "seriesId",
        type: "string",
        label: "Series ID",
        description: "The UUID of the series.",
        required: true,
      },
      {
        name: "newName",
        type: "string",
        label: "New Series Name",
        description: "The new name for the series.",
        required: true,
      },
    ],
    execute: executeRenameSeries,
  },
];