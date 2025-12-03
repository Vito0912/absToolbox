<template>
  <a
    :href="project.link"
    target="_blank"
    rel="noopener noreferrer"
    class="group block rounded-xl border border-white/10 bg-gray-900/40 p-5 transition hover:border-blue-400/50 hover:bg-gray-900/60"
  >
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <h3
          class="font-semibold text-gray-100 group-hover:text-blue-300 transition line-clamp-2"
        >
          {{ project.name }}
        </h3>
        <div
          v-if="project.githubStats"
          class="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap"
        >
          <Star class="h-3 w-3 text-yellow-400 fill-yellow-400" />
          {{ project.githubStats.stars }}
        </div>
      </div>

      <div class="text-xs text-gray-500">
        by
        <span v-for="(author, idx) in project.authors" :key="author">
          <span class="text-gray-400">{{ author }}</span>
          <span v-if="idx < project.authors.length - 1">, </span>
        </span>
      </div>

      <p class="text-sm text-gray-400 line-clamp-3 leading-relaxed">
        {{ project.description }}
      </p>

      <div
        v-if="project.githubStats"
        class="flex items-center gap-3 text-xs text-gray-500"
      >
        <div v-if="project.githubStats.forks" class="flex items-center gap-1">
          <GitFork class="h-3 w-3" />
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
        <BaseBadge v-for="tag in project.tags" :key="tag" variant="neutral">
          {{ getTagName(tag) }}
        </BaseBadge>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { Project } from "../types";
import { tagDefinitions } from "../projects";
import { BaseBadge } from "@/shared/components";
import { Star, GitFork } from "lucide-vue-next";

defineProps<{
  project: Project;
}>();

const getTagName = (tag: string) => {
  return tagDefinitions[tag]?.name || tag;
};
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
