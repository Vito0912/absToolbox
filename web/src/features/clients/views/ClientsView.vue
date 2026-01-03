<template>
  <div class="space-y-6">
    <PageHeader
      title="Clients"
      subtitle="Third-party players for Audiobookshelf"
    />

    <FilterBar
      v-model="filters"
      search-placeholder="Search clients..."
      filter-label="Operating Systems"
      :filter-options="osFilterOptions"
      :sort-options="sortOptions"
    />

    <ApiScoreLegend />

    <EmptyState
      v-if="filteredClients.length === 0"
      message="No clients found matching your filters"
      icon-path="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />

    <div v-else class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      <ClientCard
        v-for="client in filteredClients"
        :key="client.name"
        :client="client"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { ClientInfo } from "../types";
import { projects as clientsData } from "../clients";
import { ClientCard, ApiScoreLegend } from "../components";
import { PageHeader, EmptyState } from "@/shared/components";
import FilterBar from "@/shared/components/FilterBar.vue";
import type { FilterOption, SortOption } from "@/shared/types/filterBar";

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
    .map((os) => ({ value: os, label: os }));
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
        client.OSes.some((os) => os.toLowerCase().includes(search)),
    );
  }

  if (filters.value.filters.length > 0) {
    filtered = filtered.filter((client) =>
      filters.value.filters.some((os) => client.OSes.includes(os as any)),
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

onMounted(() => {
  clients.value = clientsData;
});
</script>
