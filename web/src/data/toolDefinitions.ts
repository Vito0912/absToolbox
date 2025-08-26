import type { ToolDefinition } from "@/types/tool";
import { executeSplitGenres } from "@/tools/splitGenres";
import { executeDeleteListeningSessions } from "@/tools/deleteListeningSessions";
import { executeMatchAudiobookChapters } from "@/tools/quickMatchChapters";
import { executeRemoveEmptyAuthors } from "@/tools/removeEmptyAuthors";
import { executeForceMetadata } from "@/tools/forceMetadata";
import { executeRenameSeries } from "@/tools/renameSeries";
import { executePathTagUpdater } from "@/tools/pathTagUpdater";
import { executeMigrateServer } from "@/tools/migrateServer";

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
        description: "Overrides the selected delimiter for splitting genres/tags.",
        required: false,
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
    title: "Force Metadata",
    description:
      "Adds a tag to all books in the selected library to force a metadata refresh on the next load.",
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
    title: "Migrate Server",
    description:
      "Migrates all server data to a new server.<div class='text-sm text-red-500'>There are known issues with marking podcasts episodes as played. Days and Session are still copied</div>",
    longDescription:
      "Migrates all server data to a new server.<div class='text-sm text-red-500'>There are known issues with marking podcasts episodes as played. Days and Session are still copied correctly</div><br/> <section>   <p>     To migrate a server to a new operating system or directory, you can use the     following tool to copy all stats and data. Please follow these steps     exactly:   </p>    <h3 class='font-bold mt-4'>1. Create a Backup</h3>   <p>Create a backup in the settings.</p>    <h3 class='font-bold mt-4'>2. Enable Metadata Storage</h3>   <p>     Enable the setting <strong>'Store metadata with item'</strong> in the ABS     settings:   </p>   <img src='/images/metadata.png' alt='Metadata setting screenshot' class='my-2' />    <p>     If this setting was not enabled from the beginning, you must use the     following tool to force the creation of the corresponding files:     <a       href='https://abstoolbox.vito0912.de/tool/force-metadata'       class='text-blue-500 underline hover:text-blue-700'       >Force Metadata tool</a     >.   </p>    <h3 class='font-bold mt-4'>3. Copy Library Folders</h3>   <p>     Now copy your library folders to your new server and set up your server from     scratch. Do <strong>NOT</strong> load a backup from the old server.   </p>    <h4 class='font-semibold mt-2'>When setting up your new server:</h4>   <ul class='list-disc list-inside'>     <li>       Name the libraries exactly the same. After migration, you can rename them       if you wish. The paths you add can, of course, be different.     </li>     <li>       Create all users for whom you want to migrate progress. Users that are not       created will have no progress or stats. Name the users exactly the same or       give them the same email address.     </li>   </ul>    <h3 class='font-bold mt-4'>4. Make Another Backup</h3>   <p>     After doing this, make another backup from both servers in the settings!   </p>    <h3 class='font-bold mt-4'>5. Add CORS Entry</h3>   <p>     Now add this website as a CORS entry in the settings of both servers. You     can find out how to do this here:     <a       href='https://abstoolbox.vito0912.de/settings'       class='text-blue-500 underline hover:text-blue-700'       >Settings</a     >.   </p>    <h3 class='font-bold mt-4'>Important!</h3>   <ul class='list-disc list-inside'>     <li>       The server in the       <a         href='https://abstoolbox.vito0912.de/settings'         class='text-blue-500 underline hover:text-blue-700'         >Settings</a       >       is your <strong>NEW</strong> server.     </li>     <li>       The server you enter below is your <strong>OLD</strong> server.     </li>   </ul>    <h3 class='font-bold mt-4'>6. Execute</h3>   <p>     Now you can click 'Execute' and wait. It should transfer all stats.   </p> </section>",
    fields: [
      {
        name: "serverUrl",
        type: "string",
        label: "Server URL",
        description:
          "Enter the URL of the server to migrate data from.",
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
        description: "For this script to work it needs to issue an API key for every user. Please specify (in minutes) how long the API keys should be valid. The more items you have, the longer the keys should be valid. 5 minutes should be good for a user with around 5 years of listening histories. Keys are never shared and automatically deleted. The expiration time should be set if the script fails and is unable to delete the key!",
        required: true,
        default: "5"
      }
    ],
    execute: executeMigrateServer,
  },
  {
    id: "rename-series",
    title: "Rename Series",
    description:
      "Renames a book series in the selected library.",
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
        label: "Rule Sets",
        description:
          "Define rules for updating tags and genres based on file paths. Each rule should be in the format: '<regex>:<tag name>'.",
        default: [
          '.*Fiction.*:Fiction'
        ]
      },
      {
        name: "dryRun",
        type: "boolean",
        label: "Dry Runq",
        description:
          "If enabled, the tool will simulate the changes without applying them.",
        default: true
      },
      {
        name: "type",
        type: "select",
        label: "Type",
        description: "Select whether to update tags or genres.",
        required: true,
        options: ["tags", "genres"],
        default: "tags",
      }
    ],
    execute: executePathTagUpdater
  }
];