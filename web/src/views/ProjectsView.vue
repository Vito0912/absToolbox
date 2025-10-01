<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Projects</h1>
        <p class="text-slate-400 text-sm">
          Community projects that extend the Audiobookshelf ecosystem
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="refreshProjects"
          :disabled="isLoading"
          class="inline-flex items-center justify-center px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition"
        >
          {{ isLoading ? "Loading..." : "Refresh" }}
        </button>
        <div v-if="cacheAge" class="text-xs text-slate-500">
          Updated {{ cacheAge }}
        </div>
      </div>
    </div>

    <FilterBar
      v-model="filterBarModel"
      search-placeholder="Search projects..."
      filter-label="Tags"
      :filter-options="tagFilterOptions"
      :sort-options="sortOptions"
    />

    <div
      v-if="isLoading && filteredProjects.length === 0"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"
      ></div>
      <p class="text-slate-400 mt-3">Loading projects...</p>
    </div>

    <div
      v-else-if="filteredProjects.length === 0"
      class="flex flex-col items-center justify-center py-16"
    >
      <div class="text-slate-500 mb-2">
        <svg
          class="h-12 w-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p class="text-slate-400">No projects found matching your criteria.</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <a
        v-for="project in filteredProjects"
        :key="project.id"
        :href="project.link"
        target="_blank"
        rel="noopener noreferrer"
        class="group block rounded-xl border border-white/10 bg-slate-900/40 p-5 transition hover:border-indigo-400/50 hover:bg-slate-900/60"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <h3
              class="font-semibold text-slate-100 group-hover:text-indigo-300 transition line-clamp-2"
            >
              {{ project.name }}
            </h3>
            <div
              v-if="project.githubStats"
              class="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap"
            >
              <svg
                class="h-3 w-3 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              {{ project.githubStats.stars }}
            </div>
          </div>

          <div class="text-xs text-slate-500">
            by
            <span v-for="(author, idx) in project.authors" :key="author">
              <span class="text-slate-400">{{ author }}</span
              ><span v-if="idx < project.authors.length - 1">, </span>
            </span>
          </div>

          <p class="text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {{ project.description }}
          </p>

          <div
            v-if="project.githubStats"
            class="flex items-center gap-3 text-xs text-slate-500"
          >
            <div
              v-if="project.githubStats.forks"
              class="flex items-center gap-1"
            >
              <svg
                class="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              {{ project.githubStats.forks }}
            </div>
            <div
              v-if="project.githubStats.language"
              class="flex items-center gap-1"
            >
              <span class="w-2 h-2 rounded-full bg-blue-400"></span>
              {{ project.githubStats.language }}
            </div>
          </div>

          <div class="flex flex-wrap gap-1 pt-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
            >
              {{ tagDefinitions[tag]?.name || tag }}
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Project, ProjectFilter } from "@/types/project";
import { projects, availableTags, tagDefinitions } from "@/data/projects";
import { useProjectsCache } from "@/composables/useProjectsCache";
import FilterBar from "@/components/FilterBar.vue";
import type { FilterOption, SortOption } from "@/types/filterBar";

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
  }))
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
          author.toLowerCase().includes(search)
        ) ||
        project.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }

  if (filters.value.tags.length > 0) {
    filtered = filtered.filter((project) =>
      filters.value.tags.every((tag) => project.tags.includes(tag))
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
