<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Clients</h1>
        <p class="text-slate-400 text-sm">
          Third-party applications for accessing Audiobookshelf
        </p>
      </div>
    </div>

    <FilterBar
      v-model="filters"
      search-placeholder="Search clients..."
      filter-label="Operating Systems"
      :filter-options="osFilterOptions"
      :sort-options="sortOptions"
    />

    <div class="rounded-xl border border-white/10 bg-slate-900/40 p-4">
      <h3 class="text-sm font-medium text-slate-300 mb-2">API Score Legend</h3>
      <div class="flex flex-wrap gap-4 text-xs pb-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span class="text-slate-400">0-1: Poor API usage</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-orange-500"></div>
          <span class="text-slate-400">2-3: Fair API usage</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span class="text-slate-400">4: Good API usage</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <span class="text-slate-400">5: Excellent API usage</span>
        </div>
      </div>
      <span class="text-slate-400 text-sm"
        >Always check the last tested date. Apps can change over time. This only
        represents a snapshot in time.</span
      >
      <br />
      <br />
      <span class="text-slate-400 text-sm"
        ><p>
          <strong>Disclaimer:</strong> API scores and all content on this page
          reflect my personal opinion and do not represent the views of the ABS
          dev team or ABS as a whole. Creating an app takes significant effort,
          so publishing even one is already a big achievement. If you find any
          mistakes or believe something should be updated, feel free to contact
          me on
          <a href="https://discord.com/users/339746615369793536"
            >Discord (@vito0912)</a
          >
          or send me an <a href="mailto:finn@dittmar-ldk.de">email here.</a>
        </p></span
      >
    </div>

    <div
      v-if="filteredClients.length === 0"
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
            stroke-width="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p class="text-slate-400 text-center">
        No clients found matching your filters
      </p>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      <div
        v-for="client in filteredClients"
        :key="client.name"
        class="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur transition hover:border-white/20 hover:bg-slate-900/80"
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
              <div v-else class="h-12 w-12 rounded-lg bg-slate-600"></div>
              <div>
                <h3 class="text-lg font-semibold text-slate-100">
                  <a
                    :href="client.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:text-indigo-300 transition-colors"
                  >
                    {{ client.name }}
                    <svg
                      class="inline h-4 w-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </h3>
                <p class="text-sm text-slate-400">{{ client.language }}</p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="getCostBadgeClass(client.cost)"
                >
                  {{ client.cost }}
                </span>
                <span
                  v-if="client.openSource"
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-600/20 text-green-300"
                >
                  Open Source
                </span>
                <span
                  v-if="!client.openSource"
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-600/20 text-yellow-300"
                >
                  Closed Source
                </span>
              </div>

              <div
                v-if="client.features.tested.wasTested"
                class="flex items-center gap-1"
              >
                <span class="text-xs text-slate-400">API Score:</span>
                <div
                  class="w-3 h-3 rounded-full"
                  :class="
                    getApiScoreColor(client.features.tested.usedApiCorrectly)
                  "
                ></div>
                <span class="text-xs font-medium text-slate-300">
                  {{
                    client.features.tested.usedApiCorrectly != undefined
                      ? client.features.tested.usedApiCorrectly
                      : "N/A"
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div
              v-if="
                client.features.tested.usedApiCorrectly === 0 ||
                client.features.tested.usedApiCorrectly === 1
              "
              class="text-xs font-medium text-red-800"
            >
              Apps with 1 or 0 should not be used with a production ABS server
              as they can cause bigger issues to stats, progress and worse
              performance if not use many resources for transcoding jobs.
              Reminder to read the Disclaimer at the top, as this is my personal
              assessment and experience at the time of testing.
            </div>
            <h4 class="text-sm font-medium text-slate-300 mb-2">
              Operating Systems
            </h4>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="os in client.OSes"
                :key="os"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300"
              >
                {{ os }}
              </span>
            </div>
          </div>

          <div v-if="client.notes && client.notes.length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-slate-300 mb-2">Notes</h4>
            <div class="space-y-2">
              <div
                v-for="(note, index) in client.notes"
                :key="index"
                class="flex items-start gap-2 p-2 rounded-lg"
                :class="getNoteBackgroundClass(note.color)"
              >
                <div
                  class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  :class="getNoteColorClass(note.color)"
                ></div>
                <p class="text-xs text-slate-300">{{ note.text }}</p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-slate-300 mb-2">Features</h4>
            <div class="space-y-3">
              <!-- Media Types -->
              <div>
                <h5 class="text-xs font-medium text-slate-400 mb-1">
                  Media Support
                </h5>
                <div class="grid grid-cols-2 gap-1 text-xs">
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.audiobooks)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.audiobooks)"
                      class="h-3 w-3"
                    />
                    Audiobooks
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.podcasts)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.podcasts)"
                      class="h-3 w-3"
                    />
                    Podcasts
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.ebooks?.available)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.ebooks?.available)"
                      class="h-3 w-3"
                    />
                    E-books
                  </div>
                </div>

                <!-- E-book subcategories -->
                <div
                  v-if="client.features.ebooks?.available"
                  class="ml-4 mt-1 grid grid-cols-2 gap-1 text-xs"
                >
                  <div
                    class="flex items-center gap-1"
                    :class="
                      getFeatureClass(client.features.ebooks?.ePubSupport)
                    "
                  >
                    <component
                      :is="getFeatureIcon(client.features.ebooks?.ePubSupport)"
                      class="h-3 w-3"
                    />
                    ePub Support
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.ebooks?.pdfSupport)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.ebooks?.pdfSupport)"
                      class="h-3 w-3"
                    />
                    PDF Support
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="
                      getFeatureClass(client.features.ebooks?.annotations)
                    "
                  >
                    <component
                      :is="getFeatureIcon(client.features.ebooks?.annotations)"
                      class="h-3 w-3"
                    />
                    Annotations
                  </div>
                </div>
              </div>

              <!-- Playback Features -->
              <div>
                <h5 class="text-xs font-medium text-slate-400 mb-1">
                  Playback
                </h5>
                <div class="grid grid-cols-2 gap-1 text-xs">
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.queue)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.queue)"
                      class="h-3 w-3"
                    />
                    Queue
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.autoqueue)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.autoqueue)"
                      class="h-3 w-3"
                    />
                    Auto Queue
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.sleepTimer)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.sleepTimer)"
                      class="h-3 w-3"
                    />
                    Sleep Timer
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.chapters)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.chapters)"
                      class="h-3 w-3"
                    />
                    Chapters
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.playHistory)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.playHistory)"
                      class="h-3 w-3"
                    />
                    Play History
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.shakeToRewind)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.shakeToRewind)"
                      class="h-3 w-3"
                    />
                    Shake to Rewind
                  </div>
                </div>
              </div>

              <!-- Technical Features -->
              <div>
                <h5 class="text-xs font-medium text-slate-400 mb-1">
                  Technical
                </h5>
                <div class="grid grid-cols-2 gap-1 text-xs">
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.downloads)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.downloads)"
                      class="h-3 w-3"
                    />
                    Downloads
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.customHeaders)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.customHeaders)"
                      class="h-3 w-3"
                    />
                    Custom Headers
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.caching)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.caching)"
                      class="h-3 w-3"
                    />
                    Caching
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.biggerScreens)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.biggerScreens)"
                      class="h-3 w-3"
                    />
                    Bigger Screens
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.oidc)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.oidc)"
                      class="h-3 w-3"
                    />
                    OIDC
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.carSupport)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.carSupport)"
                      class="h-3 w-3"
                    />
                    Car Support
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.widgets)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.widgets)"
                      class="h-3 w-3"
                    />
                    Widgets
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="getFeatureClass(client.features.bookmarks)"
                  >
                    <component
                      :is="getFeatureIcon(client.features.bookmarks)"
                      class="h-3 w-3"
                    />
                    Bookmarks
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              client.features.tested.comments &&
              client.features.tested.comments.length > 0
            "
            class="mb-4"
          >
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

          <div
            v-if="client.features.tested.date"
            class="text-xs text-slate-500"
          >
            Last tested: {{ formatDate(client.features.tested.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from "vue";
import type { ClientInfo } from "@/types/clients";
import { projects as clientsData } from "@/data/clients";
import FilterBar from "@/components/FilterBar.vue";
import type { FilterOption, SortOption } from "@/types/filterBar";

const clients = ref<ClientInfo[]>([]);

const filters = ref({
  search: "",
  filters: [] as string[],
  sortBy: "name" as "name" | "apiScore" | "cost",
  sortDirection: "asc" as "asc" | "desc",
});

const osFilterOptions = computed<FilterOption[]>(() => {
  const oses = new Set<string>();
  clients.value.forEach((client) => {
    client.OSes.forEach((os) => oses.add(os));
  });
  return Array.from(oses)
    .sort()
    .map((os) => ({
      value: os,
      label: os,
    }));
});

const sortOptions = computed<SortOption[]>(() => [
  { value: "name", label: "Name" },
  { value: "apiScore", label: "API Score" },
  { value: "cost", label: "Cost" },
]);

const filteredClients = computed(() => {
  let filtered = clients.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(
      (client) =>
        client.name.toLowerCase().includes(search) ||
        client.language.toLowerCase().includes(search) ||
        client.OSes.some((os) => os.toLowerCase().includes(search))
    );
  }

  if (filters.value.filters.length > 0) {
    filtered = filtered.filter((client) =>
      filters.value.filters.some((os) => client.OSes.includes(os as any))
    );
  }

  filtered.sort((a, b) => {
    let aVal: any, bVal: any;

    switch (filters.value.sortBy) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "apiScore":
        aVal = a.features.tested.usedApiCorrectly || 0;
        bVal = b.features.tested.usedApiCorrectly || 0;
        break;
      case "cost":
        const costOrder = { Free: 0, Freemium: 1, Paid: 2 };
        aVal = costOrder[a.cost];
        bVal = costOrder[b.cost];
        break;
      default:
        return 0;
    }

    if (filters.value.sortDirection === "desc") {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    } else {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    }
  });

  return filtered;
});

const getFeatureClass = (feature: boolean | undefined) => {
  if (feature === true) return "text-green-400";
  if (feature === false) return "text-red-400";
  return "text-slate-500";
};

const getFeatureIcon = (feature: boolean | undefined) => {
  if (feature === true) {
    return h(
      "svg",
      {
        fill: "currentColor",
        viewBox: "0 0 20 20",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
          "clip-rule": "evenodd",
        }),
      ]
    );
  } else if (feature === false) {
    return h(
      "svg",
      {
        fill: "currentColor",
        viewBox: "0 0 20 20",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
          "clip-rule": "evenodd",
        }),
      ]
    );
  } else {
    return h(
      "svg",
      {
        fill: "currentColor",
        viewBox: "0 0 20 20",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z",
          "clip-rule": "evenodd",
        }),
      ]
    );
  }
};

const getCostBadgeClass = (cost: string) => {
  switch (cost) {
    case "Free":
      return "bg-green-600/20 text-green-300";
    case "Freemium":
    case "Paid":
      return "bg-yellow-600/20 text-yellow-300";
    default:
      return "bg-slate-600/20 text-slate-300";
  }
};

const getApiScoreColor = (score: number | undefined) => {
  if (score == undefined) return "bg-slate-500";
  if (score <= 1) return "bg-red-500";
  if (score <= 3) return "bg-orange-500";
  if (score === 4) return "bg-yellow-500";
  return "bg-green-500";
};

const getNoteColorClass = (color: string) => {
  switch (color) {
    case "red":
      return "bg-red-400";
    case "yellow":
      return "bg-yellow-400";
    case "blue":
      return "bg-blue-400";
    case "green":
      return "bg-green-400";
    default:
      return "bg-slate-400";
  }
};

const getNoteBackgroundClass = (color: string) => {
  switch (color) {
    case "red":
      return "bg-red-600/10 border border-red-600/20";
    case "yellow":
      return "bg-yellow-600/10 border border-yellow-600/20";
    case "blue":
      return "bg-blue-600/10 border border-blue-600/20";
    case "green":
      return "bg-green-600/10 border border-green-600/20";
    default:
      return "bg-slate-600/10 border border-slate-600/20";
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "https://via.placeholder.com/48/64748b/cbd5e1?text=?";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  clients.value = clientsData;
});
</script>
