import { ref } from 'vue';
import type { Project, GitHubStats, ProjectsCache } from '@/types/project';

const CACHE_KEY = 'abs-toolbox-projects-cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const useProjectsCache = () => {
  const isLoading = ref(false);

  const getCachedProjects = (): ProjectsCache | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data = JSON.parse(cached) as ProjectsCache;
      const now = new Date().getTime();
      const cacheTime = new Date(data.lastUpdated).getTime();
      
      if (now - cacheTime < CACHE_DURATION) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error reading projects cache:', error);
      return null;
    }
  };

  const setCachedProjects = (projects: Project[]) => {
    try {
      const cache: ProjectsCache = {
        projects,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving projects cache:', error);
    }
  };

  const extractGitHubRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  };

  const fetchGitHubStats = async (url: string): Promise<GitHubStats | null> => {
    const repoInfo = extractGitHubRepoInfo(url);
    if (!repoInfo) return null;

    try {
      const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
      if (!response.ok) {
        console.warn(`Failed to fetch GitHub stats for ${url}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        issues: data.open_issues_count || 0,
        language: data.language || 'Unknown',
        lastUpdated: data.updated_at || '',
        description: data.description || '',
        topics: data.topics || []
      };
    } catch (error) {
      console.error(`Error fetching GitHub stats for ${url}:`, error);
      return null;
    }
  };

  const fetchProjectsWithStats = async (baseProjects: Project[]): Promise<Project[]> => {
    isLoading.value = true;
    
    try {
      const cached = getCachedProjects();
      if (cached) {
        isLoading.value = false;
        return cached.projects;
      }

      const projectsWithStats = await Promise.all(
        baseProjects.map(async (project) => {
          const githubStats = await fetchGitHubStats(project.link);
          return {
            ...project,
            githubStats: githubStats || undefined,
            lastFetched: new Date().toISOString()
          };
        })
      );

      setCachedProjects(projectsWithStats);
      isLoading.value = false;
      return projectsWithStats;
    } catch (error) {
      console.error('Error fetching projects with stats:', error);
      isLoading.value = false;
      return baseProjects;
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing projects cache:', error);
    }
  };

  const getCacheAge = (): string | null => {
    const cached = getCachedProjects();
    if (!cached) return null;
    
    const cacheTime = new Date(cached.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - cacheTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  return {
    isLoading,
    fetchProjectsWithStats,
    clearCache,
    getCacheAge,
    getCachedProjects
  };
};