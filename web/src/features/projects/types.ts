export interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  language: string;
  lastUpdated: string;
  description: string;
  topics: string[];
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description?: string;
  authors: string[];
  authorLinks: string[];
  tags: string[];
  githubStats?: GitHubStats;
  lastFetched?: string;
  testedVersion?: string;
}

export interface ProjectsCache {
  projects: Project[];
  lastUpdated: string;
}

export interface ProjectFilter {
  search: string;
  tags: string[];
  sortBy: "name" | "stars" | "lastUpdated" | "forks";
  sortDirection: "asc" | "desc";
}

export interface TagDefinition {
  name: string;
  description: string;
}
