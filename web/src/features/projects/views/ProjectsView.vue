<template>
  <div class="space-y-6">
    <PageHeader
      title="Projects"
      subtitle="Community projects that extend the Audiobookshelf ecosystem"
    >
      <template #actions>
        <BaseButton
          @click="refreshProjects"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ isLoading ? "Loading..." : "Refresh" }}
        </BaseButton>
        <div v-if="cacheAge" class="text-xs text-gray-500">
          Updated {{ cacheAge }}
        </div>
      </template>
    </PageHeader>

    <FilterBar
      v-model="filterBarModel"
      search-placeholder="Search projects..."
      filter-label="Tags"
      :filter-options="tagFilterOptions"
      :sort-options="sortOptions"
    />

    <LoadingSpinner
      v-if="isLoading && filteredProjects.length === 0"
      message="Loading projects..."
      full-page
    />

    <EmptyState
      v-else-if="filteredProjects.length === 0"
      message="No projects found matching your criteria."
    />

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Project, ProjectFilter } from "../types";
import { projects, availableTags, tagDefinitions } from "../projects";
import { useProjectsCache } from "../useProjectsCache";
import { ProjectCard } from "../components";
import {
  PageHeader,
  BaseButton,
  EmptyState,
  LoadingSpinner,
} from "@/shared/components";
import FilterBar from "@/shared/components/FilterBar.vue";
import type { FilterOption, SortOption } from "@/shared/types/filterBar";

const { isLoading, fetchProjectsWithStats, clearCache, getCacheAge } =
  useProjectsCache();

const projectsList = ref<Project[]>([]);
const cacheAge = ref<string | null>(null);

const filters = ref<ProjectFilter>({
  search: "",
  tags: [],
  sortBy: "name",
  sortDirection: "asc",
});

const filterBarModel = computed({
  get: () => ({
    search: filters.value.search,
    filters: filters.value.tags,
    sortBy: filters.value.sortBy,
    sortDirection: filters.value.sortDirection,
  }),
  set: (value) => {
    filters.value.search = value.search;
    filters.value.tags = value.filters;
    filters.value.sortBy = value.sortBy as ProjectFilter["sortBy"];
    filters.value.sortDirection =
      value.sortDirection as ProjectFilter["sortDirection"];
  },
});

const tagFilterOptions = computed<FilterOption[]>(() =>
  availableTags.map((tag) => ({
    value: tag,
    label: tagDefinitions[tag]?.name || tag,
    description: tagDefinitions[tag]?.description,
  })),
);

const sortOptions = computed<SortOption[]>(() => [
  { value: "name", label: "Name" },
  { value: "stars", label: "Stars" },
  { value: "lastUpdated", label: "Updated" },
  { value: "forks", label: "Forks" },
]);

const filteredProjects = computed(() => {
  let filtered = [...projectsList.value];

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.name.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search) ||
        project.authors.some((author) =>
          author.toLowerCase().includes(search),
        ) ||
        project.tags.some((tag) => tag.toLowerCase().includes(search)),
    );
  }

  if (filters.value.tags.length > 0) {
    filtered = filtered.filter((project) =>
      filters.value.tags.every((tag) => project.tags.includes(tag)),
    );
  }

  filtered.sort((a, b) => {
    let valueA: any, valueB: any;

    switch (filters.value.sortBy) {
      case "name":
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case "stars":
        valueA = a.githubStats?.stars || 0;
        valueB = b.githubStats?.stars || 0;
        break;
      case "lastUpdated":
        valueA = new Date(a.githubStats?.lastUpdated || 0).getTime();
        valueB = new Date(b.githubStats?.lastUpdated || 0).getTime();
        break;
      case "forks":
        valueA = a.githubStats?.forks || 0;
        valueB = b.githubStats?.forks || 0;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }

    if (valueA < valueB) return filters.value.sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return filters.value.sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
});

const refreshProjects = async () => {
  clearCache();
  const fetchedProjects = await fetchProjectsWithStats(projects);
  projectsList.value = fetchedProjects;
  updateCacheAge();
};

const updateCacheAge = () => {
  cacheAge.value = getCacheAge();
};

onMounted(async () => {
  const fetchedProjects = await fetchProjectsWithStats(projects);
  projectsList.value = fetchedProjects;
  updateCacheAge();
});

setInterval(updateCacheAge, 60000);
</script>
