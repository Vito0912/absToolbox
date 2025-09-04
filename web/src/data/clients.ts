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
                text: "The iOS app has no CarPlay support."
            },
            {
                color: "yellow",
                text: "There are known sync issues when listening offline or with Android Auto."
            },
{
                color: "red",
                text: "The beta for iOS currently is full. Join the ABS Discord to get notified when new spots open."
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
            biggerScreens: false,
            oidc: true,
            carSupport: true,
        }
    },
    {
        name: "Buchable",
        link: "https://github.com/Vito0912/abs_flutter",
        iconLink: "https://raw.githubusercontent.com/Vito0912/abs_flutter/refs/heads/main/assets/images/logo/logo_blue_abs.png",
        language: "Dart",
        OSes: ["Android", "Windows", "Web", "Linux"],
        openSource: true,
        cost: "Free",
        notes: [
            {
                color: "yellow",
                text: "This app was developed by me. This should not be a site to push my apps, but provide a list of all available clients."
            }
        ],
        features: {
            tested: {
                wasTested: true,
                date: "2025-01-01",
                usedApiCorrectly: 4,
                comments: ["Uses old playback API", "Uses outdated authentication method"]
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
        }
    },
    {
        name: "Tonspur",
        link: "https://tonspur.app/",
        iconLink: "https://tonspur.app/_next/image?url=%2Fapp_icon.png&w=1920&q=75",
        language: "Unknown",
        OSes: ["iOS"],
        openSource: false,
        cost: "Freemium",
        notes: [
            {
                color: "blue",
                text: "Freemium was choosen because the dev said that there will be a paid version in the future. Currently it seems to be free due to the Testflight."
            },
            {
                color: "blue",
                text: "There is an download button, but it did not work for me."
            },
            {
                color: "yellow",
                text: "The media control center does not properly shows the current time and duration. (Tested in iPad though)"
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
        }
    }
]