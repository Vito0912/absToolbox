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
      widgets: undefined,
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
        text: "Creates, but never closes an session for every item you open, regardless if you play it or not."
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
    }
  },
];