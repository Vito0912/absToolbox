<template>
  <div class="space-y-6">
    <PageHeader
      title="Audiobookshelf Toolbox"
      subtitle="Select a section to get started"
    />

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="section in sections"
        :key="section.path"
        :to="section.path"
        class="group block rounded-xl border border-white/10 bg-gray-900/40 p-6 shadow-lg shadow-black/20 transition hover:border-blue-400/40 hover:bg-blue-500/5 hover:shadow-xl"
      >
        <h2
          class="text-xl font-semibold text-gray-100 group-hover:text-white transition mb-3"
        >
          {{ section.title }}
        </h2>
        <p class="text-sm text-gray-400 leading-relaxed">
          {{ section.description }}
        </p>
        <div
          class="mt-4 text-sm text-blue-400 group-hover:text-blue-300 transition"
        >
          Explore →
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PageHeader } from "@/shared/components";

const sections = [
  {
    path: "/tools",
    title: "Tools",
    description:
      "Utilities/Tools to manage Audiobookshelf.",
  },
  {
    path: "/projects",
    title: "Projects",
    description:
      "Discover community projects that extend the Audiobookshelf.",
  },
  {
    path: "/clients",
    title: "Clients",
    description:
      "Browse third-party Audiobookshelf players.",
  },
  {
    path: "/stats",
    title: "Statistics",
    description: "Analyze your listening stats in more detail.",
  },
];
</script>
