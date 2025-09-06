export interface ClientInfo {
    name: string;
    link: string;
    iconLink?: string;
    language: string;
    OSes: ("Android" | "iOS" | "Windows" | "macOS" | "Linux" | "Web")[];
    cost: "Free" | "Freemium" | "Paid";
    openSource: boolean;
    notes?: ClientNote[];
    features: ClientFeatures;
}

export interface ClientNote {
    color: string;
    text: string;
}

export interface ClientFeatures {
    tested: {
        wasTested: boolean;
        date?: string;
        usedApiCorrectly?: 0 | 1 | 2 | 3 | 4 | 5;
        comments?: string[];
    }
    audiobooks?: boolean;
    ebooks: {
        available: boolean;
        ePubSupport?: boolean;
        pdfSupport?: boolean;
        annotations?: boolean;
    }
    podcasts?: boolean;
    queue?: boolean;
    autoqueue?: boolean;
    sleepTimer?: boolean;
    chapters?: boolean;
    playHistory?: boolean;
    shakeToRewind?: boolean;
    carSupport?: boolean;
    downloads?: boolean;
    customHeaders?: boolean;
    caching?: boolean;
    biggerScreens?: boolean;
    oidc?: boolean;
    widgets?: boolean;
    bookmarks?: boolean;
}