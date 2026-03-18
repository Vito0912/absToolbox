import type { ToolDefinition } from "./types";
import { executeSplitGenres } from "./splitGenres";
import { executeDeleteListeningSessions } from "./deleteListeningSessions";
import { executeMatchAudiobookChapters } from "./quickMatchChapters";
import { executeRemoveEmptyAuthors } from "./removeEmptyAuthors";
import { executeForceMetadata } from "./forceMetadata";
import { executeRenameSeries } from "./renameSeries";
import { executePathTagUpdater } from "./pathTagUpdater";
import { executeMigrateServer } from "./migrateServer";
import { executeListenDateUpdater } from "./listenDateUpdater";
import { executeUpdateListeningSessions } from "./updateListeningSessions";

export const toolDefinitions: ToolDefinition[] = [
  {
    id: "split-genres",
    group: "Metadata",
    title: "Split genres",
    description: "Split combined genre or tag values into separate entries.",
    longDescription:
      "Specify any genres or tags to skip (case-sensitive). Choose a delimiter to split the values. The original combined values will be removed and the new, split entries will be added to the books.",
    fields: [
      {
        name: "libraryIds",
        description:
          "Select libraries to process. If left empty, all libraries will be included.",
        type: "librarySelector",
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
      {
        name: "delimiterOverride",
        type: "string",
        label: "Delimiter Override",
        description:
          "If set, this string will be used instead of the selected delimiter.",
        required: false,
      },
    ],
    execute: executeSplitGenres,
  },
  {
    id: "delete-listening-sessions",
    group: "Stats",
    title: "Delete long listening sessions",
    description:
      "Delete listening sessions that are longer than a given threshold.",
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
    group: "Metadata",
    title: "Match audiobook chapters",
    description:
      "Try to match or add chapters for audiobooks using AudiobookShelf.",
    longDescription:
      "Search for chapter information using the selected provider and add or update chapters for matching books. This may overwrite chapters that were added manually.",
    fields: [
      {
        name: "libraryId",
        type: "singleLibrarySelector",
        label: "Library ID",
        description: "The UUID of the library to process.",
        required: true,
      },
      {
        name: "chapterThreshold",
        type: "string",
        label: "Chapter Threshold",
        description:
          "Number used to decide if a book has too few chapters. Use a large value to avoid overwriting existing chapters.",
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
          "If enabled, try to find the book's ASIN. If disabled and no ASIN is found, tracks may be used as chapters.",
        required: true,
        default: true,
      },
      {
        name: "useTracksAsChapters",
        type: "boolean",
        label: "Use Tracks as Chapters",
        description:
          "Use tracks as chapters if no ASIN is available (fallback).",
        required: true,
        default: false,
      },
      {
        name: "disableRateProtection",
        type: "boolean",
        label: "Disable Rate Protection",
        description:
          "Allow faster requests at the risk of timeouts or rate limits.",
        required: true,
        default: false,
      },
    ],
    execute: executeMatchAudiobookChapters,
  },
  {
    id: "delete-orphaned-authors",
    group: "Metadata",
    title: "Remove authors without books",
    description:
      "Remove author entries that have no associated books in the selected libraries.",
    fields: [
      {
        name: "libraryIds",
        type: "librarySelector",
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
    group: "Metadata",
    title: "Force metadata refresh",
    description:
      "Add a tag to books so the server will refresh their metadata on next load.",
    fields: [
      {
        name: "libraryIds",
        type: "librarySelector",
        label: "Library IDs",
        description:
          "Select libraries to process. If left empty, all libraries will be included.",
        required: true,
      },
    ],
    execute: executeForceMetadata,
  },
  {
    id: "migrate-server",
    group: "Admin",
    title: "Migrate server data",
    description:
      "Copy statistics and user data from an existing ABS server to a new one. Some podcast play states may not transfer correctly.",
    longDescription:
      "Migrates all server data to a new server.<div class='text-sm text-red-500'>There are known issues with marking podcasts episodes as played. Days and Session are still copied correctly</div><br/> <section>   <p>     To migrate a server to a new operating system or directory, you can use the     following tool to copy all stats and data. Please follow these steps     exactly:   </p>    <h3 class='font-bold mt-4'>1. Create a Backup</h3>   <p>Create a backup in the settings.</p>    <h3 class='font-bold mt-4'>2. Enable Metadata Storage</h3>   <p>     Enable the setting <strong>'Store metadata with item'</strong> in the ABS     settings:   </p>   <img src='/images/metadata.png' alt='Metadata setting screenshot' class='my-2' />    <p>     If this setting was not enabled from the beginning, you must use the     following tool to force the creation of the corresponding files:     <a       href='https://abstoolbox.vito0912.de/tool/force-metadata'       class='text-blue-500 underline hover:text-blue-700'       >Force Metadata tool</a     >.   </p>    <h3 class='font-bold mt-4'>3. Copy Library Folders</h3>   <p>     Now copy your library folders to your new server and set up your server from     scratch. Do <strong>NOT</strong> load a backup from the old server.   </p>    <h4 class='font-semibold mt-2'>When setting up your new server:</h4>   <ul class='list-disc list-inside'>     <li>       Name the libraries exactly the same. After migration, you can rename them       if you wish. The paths you add can, of course, be different.     </li>     <li>       Create all users for whom you want to migrate progress. Users that are not       created will have no progress or stats. Name the users exactly the same or       give them the same email address.     </li>   </ul>    <h3 class='font-bold mt-4'>4. Make Another Backup</h3>   <p>     After doing this, make another backup from both servers in the settings!   </p>    <h3 class='font-bold mt-4'>5. Add CORS Entry</h3>   <p>     Now add this website as a CORS entry in the settings of both servers. You     can find out how to do this here:     <a       href='https://abstoolbox.vito0912.de/settings'       class='text-blue-500 underline hover:text-blue-700'       >Settings</a     >.   </p>    <h3 class='font-bold mt-4'>Important!</h3>   <ul class='list-disc list-inside'>     <li>       The server in the       <a         href='https://abstoolbox.vito0912.de/settings'         class='text-blue-500 underline hover:text-blue-700'         >Settings</a       >       is your <strong>NEW</strong> server.     </li>     <li>       The server you enter below is your <strong>OLD</strong> server.     </li>   </ul>    <h3 class='font-bold mt-4'>6. Execute</h3>   <p>     Now you can click 'Execute' and wait. It should transfer all stats.   </p> </section>",
    fields: [
      {
        name: "serverUrl",
        type: "string",
        label: "Server URL",
        description: "Enter the URL of the server to migrate data from.",
        required: true,
      },
      {
        name: "serverToken",
        type: "string",
        label: "Server Token",
        description:
          "Enter the authentication token for the old server. This needs to be a valid root or admin token!",
        required: true,
      },
      {
        name: "apiKeyExpiresIn",
        type: "string",
        label: "API Key Expiration Time",
        description:
          "How long (in minutes) temporary API keys should be valid while the migration runs. Increase for large libraries or long migrations. Keys are created temporarily and deleted afterwards.",
        required: true,
        default: "5",
      },
    ],
    execute: executeMigrateServer,
  },
  {
    id: "rename-series",
    group: "Metadata",
    title: "Rename series",
    description: "Change the name of a series in the selected library.",
    fields: [
      {
        name: "libraryId",
        type: "singleLibrarySelector",
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
  {
    id: "path-tag-genre-updater",
    group: "Metadata",
    title: "Path Tag and Genre Updater",
    description:
      "Updates or removes tags and genres for based on file path patterns. Inspiration taken from <a href='https://github.com/bengalih/ABS-scripts/blob/main/ApTaGu.md' target='_blank' class='text-blue-500 hover:underline'>ApTaGu</a>.",
    fields: [
      {
        name: "libraryId",
        type: "singleLibrarySelector",
        label: "Library ID",
        description: "The UUID of the library.",
        required: true,
      },
      {
        name: "ruleSets",
        type: "stringArray",
        label: "Rule sets",
        description:
          "One rule per entry in the format '<regex>:<tag name>'. If a path matches the regex, the tag will be added or removed depending on the rule.",
        default: [".*Fiction.*:Fiction"],
      },
      {
        name: "dryRun",
        type: "boolean",
        label: "Dry run",
        description:
          "When enabled, show the changes that would be made without applying them.",
        default: true,
      },
      {
        name: "type",
        type: "select",
        label: "Type",
        description: "Select whether to update tags or genres.",
        required: true,
        options: ["tags", "genres"],
        default: "tags",
      },
    ],
    execute: executePathTagUpdater,
  },
  {
    id: "listen-date-updater",
    group: "Stats",
    title: "Update listen dates",
    description:
      "Set or correct the start and finished dates for selected library items.",
    fields: [
      {
        name: "libraryItemIds",
        type: "libraryItemsSelector",
        label: "Library Item IDs",
        description: "The UUIDs of the library items.",
        required: true,
      },
      {
        name: "startDate",
        type: "date",
        label: "Start Date",
        description:
          "The date when listening started. Optional - if not provided, will use existing progress start date or finished date.",
        required: false,
      },
      {
        name: "useLastListenDate",
        type: "boolean",
        label: "Use Last Listen Date",
        description:
          "If enabled, set the finished date to the last recorded listen time from sessions.",
        required: false,
        default: false,
      },
      {
        name: "finishedDate",
        type: "date",
        label: "Finished Date",
        description:
          "The date when listening finished. Optional if 'Use Last Listen Date' is enabled. If neither this nor the checkbox is set, today's date will be used.",
        required: false,
      },
    ],
    execute: executeListenDateUpdater,
  },
  {
    id: "edit-listening-sessions",
    group: "Stats",
    title: "Edit listening sessions",
    description:
      "Manually edit a user's listening sessions to correct times or durations.",
    fields: [
      {
        name: "userId",
        type: "sessionSelector",
        label: "Select User and Sessions",
        description: "Choose a user to view and edit their listening sessions.",
        required: true,
      },
    ],
    execute: executeUpdateListeningSessions,
  },
];
