<template>
  <div
    class="group relative rounded-xl border border-white/10 bg-gray-900/60 backdrop-blur transition hover:border-white/20 hover:bg-gray-900/80"
  >
    <div class="p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div
            v-if="client.iconLink"
            class="h-12 w-12 rounded-lg overflow-hidden"
          >
            <img
              :src="client.iconLink"
              :alt="`${client.name} icon`"
              class="h-full w-full object-cover"
              @error="handleImageError"
            />
          </div>
          <div v-else class="h-12 w-12 rounded-lg bg-gray-600"></div>
          <div>
            <h3 class="text-lg font-semibold text-gray-100">
              <a
                :href="client.link"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-blue-300 transition-colors"
              >
                {{ client.name }}
                <ExternalLink class="inline h-4 w-4 ml-1" />
              </a>
            </h3>
            <p class="text-sm text-gray-400">{{ client.language }}</p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-2">
            <BaseBadge :variant="getCostVariant(client.cost)">{{
              client.cost
            }}</BaseBadge>
            <BaseBadge :variant="client.openSource ? 'success' : 'warning'">
              {{ client.openSource ? "Open Source" : "Closed Source" }}
            </BaseBadge>
            <div v-if="client.heavyAiUsage" class="group/ai relative">
              <BaseBadge variant="warning" class="cursor-help"
                >Heavy AI Use</BaseBadge
              >
              <div
                class="absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover/ai:opacity-100 group-hover/ai:visible transition-all duration-200 z-50"
              >
                <p class="text-xs text-gray-300 leading-relaxed">
                  <strong class="text-orange-300">Why is this displayed?</strong
                  ><br /><br />
                  I personally test every app listed here. Apps built heavily
                  with AI tend to change frequently, break more often, and
                  require significantly more time to test and document.<br /><br />
                  This badge doesn't reflect the app's quality directly, but
                  indicates that the app was primarily written by AI rather than
                  a human developer. This may result in potential security
                  concerns, maintainability issues, or unexpected behavior.<br /><br />
                  AI usage is completely fine to help. Heavy AI usage for me
                  means that code was obviously generated (only or by a big
                  margin) by AI.
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="client.features.tested.wasTested"
            class="flex items-center gap-1"
          >
            <span class="text-xs text-gray-400">API Score:</span>
            <div
              class="w-3 h-3 rounded-full"
              :class="getApiScoreColor(client.features.tested.usedApiCorrectly)"
            ></div>
            <span class="text-xs font-medium text-gray-300">
              {{ client.features.tested.usedApiCorrectly ?? "N/A" }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="client.features.tested.usedApiCorrectly === 0"
        class="text-xs font-medium text-red-800 mb-4"
      >
        This app has a score of 0, meaning it has serious issues with the API,
        including but not limited to: not syncing progress, not using sessions,
        permission errors or general very bad usage of the API.
      </div>

      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-300 mb-2">
          Operating Systems
        </h4>
        <div class="flex flex-wrap gap-1">
          <BaseBadge v-for="os in client.OSes" :key="os" variant="neutral">{{
            os
          }}</BaseBadge>
        </div>
      </div>

      <div v-if="client.notes && client.notes.length > 0" class="mb-4">
        <h4 class="text-sm font-medium text-gray-300 mb-2">Notes</h4>
        <div class="space-y-2">
          <div
            v-for="(note, index) in client.notes"
            :key="index"
            class="flex items-start gap-2 p-2 rounded-lg"
            :class="getNoteBackgroundClass(note.color)"
          >
            <div
              class="w-2 h-2 rounded-full mt-1.5 shrink-0"
              :class="getNoteColorClass(note.color)"
            ></div>
            <p class="text-xs text-gray-300">{{ note.text }}</p>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-300 mb-2">Features</h4>
        <ClientFeatures :features="client.features" />
      </div>

      <div v-if="client.features.tested.comments?.length" class="mb-4">
        <h4 class="text-sm font-medium text-white-300 mb-2">
          Testing Comments
        </h4>
        <ul class="space-y-1 text-xs text-gray-300">
          <li
            v-for="comment in client.features.tested.comments"
            :key="comment"
            class="flex items-start gap-1"
          >
            <span class="text-orange-400 mt-1">•</span>
            {{ comment }}
          </li>
        </ul>
      </div>

      <div v-if="client.features.tested.date" class="text-xs text-gray-500">
        Last tested: {{ formatDate(client.features.tested.date) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientInfo } from "../types";
import { BaseBadge } from "@/shared/components";
import ClientFeatures from "./ClientFeatures.vue";
import { ExternalLink } from "lucide-vue-next";

defineProps<{
  client: ClientInfo;
}>();

const getCostVariant = (cost: string) => {
  return cost === "Free" ? "success" : "warning";
};

const getApiScoreColor = (score: number | undefined) => {
  if (score == undefined) return "bg-gray-500";
  if (score <= 1) return "bg-red-500";
  if (score <= 3) return "bg-orange-500";
  if (score === 4) return "bg-yellow-500";
  return "bg-green-500";
};

const getNoteColorClass = (color: string) => {
  const colors: Record<string, string> = {
    red: "bg-red-400",
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
  };
  return colors[color] || "bg-gray-400";
};

const getNoteBackgroundClass = (color: string) => {
  const colors: Record<string, string> = {
    red: "bg-red-600/10 border border-red-600/20",
    yellow: "bg-yellow-600/10 border border-yellow-600/20",
    blue: "bg-blue-600/10 border border-blue-600/20",
    green: "bg-green-600/10 border border-green-600/20",
  };
  return colors[color] || "bg-gray-600/10 border border-gray-600/20";
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "https://via.placeholder.com/48/64748b/cbd5e1?text=?";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>
