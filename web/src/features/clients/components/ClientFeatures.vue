<template>
  <div class="space-y-3">
    <!-- Media Types -->
    <div>
      <h5 class="text-xs font-medium text-gray-400 mb-1">Media Support</h5>
      <div class="grid grid-cols-2 gap-1 text-xs">
        <FeatureIndicator :available="features.audiobooks"
          >Audiobooks</FeatureIndicator
        >
        <FeatureIndicator :available="features.podcasts"
          >Podcasts</FeatureIndicator
        >
        <FeatureIndicator :available="features.ebooks?.available"
          >E-books</FeatureIndicator
        >
      </div>

      <!-- E-book subcategories -->
      <div
        v-if="features.ebooks?.available"
        class="ml-4 mt-1 grid grid-cols-2 gap-1 text-xs"
      >
        <FeatureIndicator :available="features.ebooks?.ePubSupport"
          >ePub Support</FeatureIndicator
        >
        <FeatureIndicator :available="features.ebooks?.pdfSupport"
          >PDF Support</FeatureIndicator
        >
        <FeatureIndicator :available="features.ebooks?.annotations"
          >Annotations</FeatureIndicator
        >
      </div>
    </div>

    <!-- Playback Features -->
    <div>
      <h5 class="text-xs font-medium text-gray-400 mb-1">Playback</h5>
      <div class="grid grid-cols-2 gap-1 text-xs">
        <FeatureIndicator :available="features.queue">Queue</FeatureIndicator>
        <FeatureIndicator :available="features.autoqueue"
          >Auto Queue</FeatureIndicator
        >
        <FeatureIndicator :available="features.sleepTimer"
          >Sleep Timer</FeatureIndicator
        >
        <FeatureIndicator :available="features.chapters"
          >Chapters</FeatureIndicator
        >
        <FeatureIndicator :available="features.playHistory"
          >Play History</FeatureIndicator
        >
        <FeatureIndicator :available="features.shakeToRewind"
          >Shake to Rewind</FeatureIndicator
        >
      </div>
    </div>

    <!-- Technical Features -->
    <div>
      <h5 class="text-xs font-medium text-gray-400 mb-1">Technical</h5>
      <div class="grid grid-cols-2 gap-1 text-xs">
        <FeatureIndicator :available="features.downloads"
          >Downloads</FeatureIndicator
        >
        <FeatureIndicator :available="features.customHeaders"
          >Custom Headers</FeatureIndicator
        >
        <FeatureIndicator :available="features.caching"
          >Caching</FeatureIndicator
        >
        <FeatureIndicator :available="features.biggerScreens"
          >Bigger Screens</FeatureIndicator
        >
        <div
          class="flex items-center gap-1"
          :class="features.oidc?.available ? 'text-green-400' : 'text-gray-500'"
        >
          <FeatureIndicator :available="features.oidc?.available">
            OIDC
            <span
              v-if="
                features.oidc?.available && features.oidc?.mobileRedirectURI
              "
              class="inline-flex items-center ml-1 text-gray-400 text-xs"
            >
              {{ features.oidc?.mobileRedirectURI }}
            </span>
          </FeatureIndicator>
        </div>
        <FeatureIndicator :available="features.carSupport"
          >Car Support</FeatureIndicator
        >
        <FeatureIndicator :available="features.widgets"
          >Widgets</FeatureIndicator
        >
        <FeatureIndicator :available="features.bookmarks"
          >Bookmarks</FeatureIndicator
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientFeatures } from "../types";
import { FeatureIndicator } from "@/shared/components";

defineProps<{
  features: ClientFeatures;
}>();
</script>
