import type { ClientInfo } from '@/types/clients';
import { factory } from 'typescript';

export const projects: ClientInfo[] = [
  {
    name: "Audiobookshelf",
    link: "https://www.audiobookshelf.org/",
    iconLink: "https://www.audiobookshelf.org/Logo.png",
    language: "Kotlin, Swift, Vue",
    OSes: ["Android", "iOS"],
    openSource: true,
    cost: "Free",
    notes: [
      {
        color: "blue",
        text: "The iOS app does not support CarPlay. Downloads do not resume in the background."
      },
      {
        color: "yellow",
        text: "There are known sync issues when listening offline or with Android Auto."
      },
      {
        color: "red",
        text: "The iOS beta is currently full. Join the ABS Discord to get notified when new spots open."
      }
    ],
    features: {
      tested: {
        wasTested: true,
        date: "2025-09-04",
        usedApiCorrectly: 5,
      },
      ebooks: {
        available: true,
        pdfSupport: true,
        ePubSupport: true,
        annotations: false,
      },
      audiobooks: true,
      podcasts: true,
      queue: false,
      autoqueue: false,
      sleepTimer: true,
      chapters: true,
      playHistory: true,
      shakeToRewind: true,
      downloads: true,
      customHeaders: false,
      caching: false,
      biggerScreens: true,
      oidc: true,
      carSupport: true,
      widgets: true,
      bookmarks: true,
    }
  },
  {
    name: "Buchable",
    link: "https://github.com/Vito0912/abs_flutter",
    iconLink:
      "https://raw.githubusercontent.com/Vito0912/abs_flutter/refs/heads/main/assets/images/logo/logo_blue_abs.png",
    language: "Dart",
    OSes: ["Android", "Windows", "Web", "Linux"],
    openSource: true,
    cost: "Free",
    notes: [
      {
        color: "yellow",
        text: "This app was developed by me. This should not be a site to promote my apps, but rather provide a list of all available clients. In fact, I think the design is not that good."
      },
     {
        color: "yellow",
        text: "Downloads can be unstable on some devices. Multi-File books crash the app on Windows."
      }
    ],
    features: {
      tested: {
        wasTested: true,
        date: "2025-01-01",
        usedApiCorrectly: 3,
        comments: [
          "Uses old playback API",
          "Uses outdated authentication method"
        ]
      },
      ebooks: {
        available: false,
      },
      audiobooks: true,
      podcasts: true,
      queue: true,
      autoqueue: false,
      sleepTimer: true,
      chapters: true,
      playHistory: true,
      shakeToRewind: true,
      downloads: true,
      customHeaders: true,
      caching: true,
      biggerScreens: true,
      oidc: false,
      carSupport: false,
      widgets: false,
      bookmarks: false,
    }
  },
  {
    name: "Shelfplayer",
    link: "https://github.com/rasmuslos/ShelfPlayer",
    iconLink: "https://github.com/rasmuslos/ShelfPlayer/blob/main/Multiplatform/Assets.xcassets/Logo.imageset/ShelfPlayer.png?raw=true",
    language: "Swift",
    OSes: ["iOS"],
    openSource: true,
    cost: "Paid",
    notes: [
      {
        color: "blue",
        text: "Any features are only from the GitHub page, as I have not tested this app myself"
      }
    ],
    features: {
      tested: {
        wasTested: false,
        date: undefined,
        usedApiCorrectly: undefined,
        comments: []
      },
      ebooks: {
        available: true,
        ePubSupport: false,
        pdfSupport: true,
        annotations: false,
      },
      audiobooks: true,
      podcasts: undefined,
      queue: true,
      autoqueue: undefined,
      sleepTimer: false,
      chapters: true,
      playHistory: undefined,
      shakeToRewind: undefined,
      downloads: true,
      customHeaders: undefined,
      caching: undefined,
      biggerScreens: true,
      oidc: false,
      carSupport: true,
      widgets: true,
      bookmarks: undefined,
    }
  },
  {
    name: "Plappa",
    link: "https://github.com/LeoKlaus/plappa",
    iconLink: undefined,
    language: "Unknown",
    OSes: ["iOS"],
    openSource: false,
    cost: "Freemium",
    notes: [
      {
        color: "green",
        text: "Supports watchOS (from what I read on the GitHub page)"
      },
      {
        color: "yellow",
        text: "Always uses /download for streaming books which can lead to issues and blocks listening without download permission. See https://github.com/advplyr/audiobookshelf/issues/4196#issuecomment-2797497694"
      },
      {
        color: "blue",
        text: "The libraries are in another sort order"
      }
    ],
    features: {
      tested: {
        wasTested: true,
        date: "09-06-2025",
        usedApiCorrectly: 3,
        comments: [
          "Can cause race conditions due to syncing twice at the same time (Will be fixed after ABS is restarted in recent ABS versions)",
          "Calls the user object every ~10 seconds that can be up to 1MB in size, additional to streaming a book",
          "Does not use the /play endpoint, but uses sessions"
        ]
      },
      ebooks: {
        available: false,
        ePubSupport: false,
        pdfSupport: false,
        annotations: false,
      },
      audiobooks: true,
      podcasts: false,
      queue: true,
      autoqueue: true,
      sleepTimer: true,
      chapters: true,
      playHistory: false,
      shakeToRewind: undefined,
      downloads: true,
      customHeaders: true,
      caching: undefined,
      biggerScreens: true,
      oidc: true,
      carSupport: undefined,
      widgets: true,
      bookmarks: true
    }
  },
  {
    name: "Lissen",
    link: "https://github.com/GrakovNe/lissen-android",
    iconLink: "https://github.com/GrakovNe/lissen-android/blob/main/metadata/en-US/images/icon.png?raw=true",
    language: "Kotlin",
    OSes: ["Android"],
    openSource: true,
    cost: "Free",
    notes: [
      {
        color: "green",
        text: "Supports Android Auto in a beta branch (but currently not in the Play Store version)"
      },
      {
        color: "blue",
        text: "I would give this a score of 2.5, because only the download endpoint is problematic. Creating a session every time is not ideal, and syncing when not actively listening is also not good, but not \"critical\" and due to the working design (and awesome download option), I think a score of 2 would be unfair."
      },
    ],
    features: {
      tested: {
        wasTested: true,
        date: "09-06-2025",
        usedApiCorrectly: 3,
        comments: [
          "Uses old playback API",
          "Uses a non-download endpoint for downloads, which allows users to download even without download permission and incorrect logging",
          "Does sync even when paused, which can overwrite progress made on other clients",
          "Creates a new session for every chapter"
        ]
      },
      ebooks: {
        available: false,
        ePubSupport: false,
        pdfSupport: false,
        annotations: false,
      },
      audiobooks: true,
      podcasts: true,
      queue: false,
      autoqueue: false,
      sleepTimer: true,
      chapters: true,
      playHistory: false,
      shakeToRewind: false,
      downloads: true,
      customHeaders: true,
      caching: undefined,
      biggerScreens: true,
      oidc: true,
      carSupport: false,
      widgets: true,
      bookmarks: false
    }
  },
  {
    name: "LitLyric",
    link: "https://github.com/shane9b3/LitLyric---Beta",
    iconLink: undefined,
    language: "Unknown",
    OSes: ["Android"],
    openSource: false,
    cost: "Free",
    notes: [
      {
        color: "yellow",
        text: "In the current state, the stats are not accurate"
      },
    ],
    features: {
      tested: {
        wasTested: true,
        date: "2025-09-06",
        usedApiCorrectly: 2,
        comments: [
          "Uses a non-download endpoint for downloads, which allows users to download even without download permission and incorrect logging",  
          "Uses an old playback API",  
          "Does not use a session, which makes stats inaccurate and can cause other issues related to progress"
        ]
      },
      ebooks: {
        available: true,
        ePubSupport: true,
        pdfSupport: false,
        annotations: false,
      },
      audiobooks: true,
      podcasts: true,
      queue: false,
      autoqueue: false,
      sleepTimer: true,
      chapters: true,
      playHistory: false,
      shakeToRewind: false,
      downloads: true,
      customHeaders: false,
      caching: undefined,
      biggerScreens: undefined,
      oidc: true,
      carSupport: false,
      widgets: false,
      bookmarks: false,
    }
  },
  {
    name: "Tonspur",
    link: "https://tonspur.app/",
    iconLink:
      "https://tonspur.app/_next/image?url=%2Fapp_icon.png&w=1920&q=75",
    language: "Unknown",
    OSes: ["iOS"],
    openSource: false,
    cost: "Freemium",
    notes: [
      {
        color: "blue",
        text: "Freemium was chosen because the developer said there will be a paid version in the future. Currently, it seems to be free due to TestFlight."
      },
      {
        color: "blue",
        text: "There is a download button, but it did not work for me."
      },
      {
        color: "yellow",
        text: "The media control center does not properly show the current time and duration. (Tested on iPad)"
      }
    ],
    features: {
      tested: {
        wasTested: true,
        date: "2025-09-04",
        usedApiCorrectly: 4,
        comments: ["Uses old playback API"]
      },
      ebooks: {
        available: false,
      },
      audiobooks: true,
      podcasts: false,
      queue: true,
      autoqueue: false,
      sleepTimer: true,
      chapters: true,
      playHistory: false,
      shakeToRewind: false,
      downloads: false,
      customHeaders: false,
      caching: true,
      biggerScreens: false,
      oidc: true,
      carSupport: undefined,
      widgets: false,
      bookmarks: false,
    }
  },
  {
    name: "Kitzi ABS Player",
    link: "https://github.com/bennybar/kitzi_abs_player/tree/v0.0.5",
    iconLink: undefined,
    language: "Dart",
    OSes: ["Android"],
    openSource: true,
    cost: "Free",
    notes: [
            {
        color: "yellow",
        text: "Creates but never closes a session for every item you open, whether you play it or not"
      },
      {
        color: "red",
        text: "Creates 10s if not 100s of sessions if you download an audiobook"
      },
      {
        color: "red",
        text: "Loads every image from the server. Expect very high data usage on first login. In general does no pagination, which leads to very poor loading times"
      },
      {
        color: "red",
        text: "Does not work with the ABS Demo server/ known cases of the client not working"
      },
    ],
    features: {
      tested: {
        wasTested: true,
        date: "2025-09-06",
        usedApiCorrectly: 0,
        comments: [
          "Does no pagination, which can lead to performance issues with large libraries. Loads everything into memory",
          "Does not use sessions",
          "Uses a non-download endpoint for downloads, which allows users to download even without download permission and incorrect logging",
        ]
      },
      ebooks: {
        available: false,
        ePubSupport: false,
        pdfSupport: false,
        annotations: false,
      },
      audiobooks: true,
      podcasts: false,
      queue: false,
      autoqueue: false,
      sleepTimer: false,
      chapters: true,
      playHistory: false,
      shakeToRewind: false,
      downloads: true,
      customHeaders: false,
      caching: false,
      biggerScreens: undefined,
      oidc: false,
      carSupport: true,
      widgets: false,
      bookmarks: false,
    }
  },
];