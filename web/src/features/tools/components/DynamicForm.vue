<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-6 space-y-2">
      <h2 class="text-2xl font-semibold tracking-tight">
        {{ tool.title }}
      </h2>
      <p class="text-gray-400" v-html="tool.longDescription"></p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-for="field in tool.fields"
        :key="field.name"
        class="space-y-2 rounded-xl border border-white/10 bg-gray-900/40 p-4"
      >
        <label class="block text-sm font-medium text-gray-200">
          {{ field.label }}
          <span
            v-if="field.required"
            class="ml-1 align-middle text-rose-400"
            aria-hidden="true"
            >*</span
          >
        </label>
        <p
          v-if="field.description"
          class="text-xs leading-relaxed text-gray-400"
        >
          {{ field.description }}
        </p>

        <input
          v-if="field.type === 'string'"
          v-model="formData[field.name]"
          type="text"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
        />

        <label
          v-else-if="field.type === 'boolean'"
          class="inline-flex items-center gap-3"
        >
          <button
            type="button"
            @click="formData[field.name] = !formData[field.name]"
            class="relative h-7 w-12 rounded-full border border-white/10 transition"
            :class="formData[field.name] ? 'bg-blue-600' : 'bg-gray-800'"
          >
            <span
              class="absolute top-1 left-1 inline-block h-5 w-5 rounded-full bg-white transition"
              :class="formData[field.name] ? 'trangray-x-5' : ''"
            />
          </button>
          <span class="text-sm text-gray-300">
            {{ formData[field.name] ? "Enabled" : "Disabled" }}
          </span>
          <input
            v-model="formData[field.name]"
            type="checkbox"
            class="hidden"
          />
        </label>

        <select
          v-else-if="field.type === 'select'"
          v-model="formData[field.name]"
          :required="field.required"
          class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">Choose an option...</option>
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <div v-else-if="field.type === 'stringArray'" class="space-y-2">
          <div
            v-for="(item, index) in getArrayValue(field.name)"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="getArrayValue(field.name)[index]"
              type="text"
              :placeholder="field.placeholder"
              class="flex-1 rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="button"
              @click="removeArrayItem(field.name, index)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="getArrayValue(field.name).length <= 1"
              aria-label="Remove"
              title="Remove"
            >
              ×
            </button>
          </div>
          <button
            type="button"
            @click="addArrayItem(field.name)"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            + Add Item
          </button>
        </div>

        <div v-else-if="field.type === 'librarySelector'" class="space-y-3">
          <div
            v-if="librariesLoading[field.name]"
            class="text-sm text-gray-400"
          >
            Loading libraries...
          </div>
          <div
            v-else-if="librariesError[field.name]"
            class="text-sm text-rose-400"
          >
            Error loading libraries: {{ librariesError[field.name] }}
          </div>
          <div v-else class="space-y-2">
            <div class="flex items-center gap-2 pb-2 border-b border-white/10">
              <button
                type="button"
                @click="selectAllLibraries(field.name)"
                class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition"
              >
                Select All
              </button>
              <button
                type="button"
                @click="deselectAllLibraries(field.name)"
                class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition"
              >
                Deselect All
              </button>
              <span class="text-xs text-gray-400">
                {{ getSelectedLibrariesCount(field.name) }} of
                {{ libraries[field.name]?.length || 0 }} selected
              </span>
            </div>
            <div
              v-for="library in libraries[field.name]"
              :key="library.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"
            >
              <label class="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  :value="library.id"
                  v-model="formData[field.name]"
                  class="w-4 h-4 text-blue-600 bg-gray-800 border-white/10 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-200">{{
                    library.name
                  }}</span>
                  <span
                    class="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded"
                  >
                    {{ library.mediaType }}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div
          v-else-if="field.type === 'singleLibrarySelector'"
          class="space-y-3"
        >
          <div
            v-if="librariesLoading[field.name]"
            class="text-sm text-gray-400"
          >
            Loading libraries...
          </div>
          <div
            v-else-if="librariesError[field.name]"
            class="text-sm text-rose-400"
          >
            Error loading libraries: {{ librariesError[field.name] }}
          </div>
          <div v-else class="space-y-2">
            <div class="space-y-1">
              <div
                v-for="library in libraries[field.name]"
                :key="library.id"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"
              >
                <label class="flex items-center gap-3 cursor-pointer flex-1">
                  <input
                    type="radio"
                    :name="`radio-${field.name}`"
                    :value="library.id"
                    v-model="formData[field.name]"
                    class="w-4 h-4 text-blue-600 bg-gray-800 border-white/10 focus:ring-blue-500 focus:ring-2"
                  />
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-200">{{
                      library.name
                    }}</span>
                    <span
                      class="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded"
                    >
                      {{ library.mediaType }}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="field.type === 'libraryItemsSelector'"
          class="space-y-3"
        >
          <div
            v-if="librariesLoading[field.name]"
            class="text-sm text-gray-400"
          >
            Loading libraries...
          </div>
          <div
            v-else-if="librariesError[field.name]"
            class="text-sm text-rose-400"
          >
            Error loading libraries: {{ librariesError[field.name] }}
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-gray-200"
              >Choose Library</label
            >
            <select
              v-model="selectedLibrary[field.name]"
              @change="
                loadLibraryItems(field.name, selectedLibrary[field.name])
              "
              class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">-- Select a library --</option>
              <option
                v-for="library in libraries[field.name]"
                :key="library.id"
                :value="library.id"
              >
                {{ library.name }} ({{ library.mediaType }})
              </option>
            </select>

            <div v-if="selectedLibrary[field.name]" class="mt-4 space-y-2">
              <input
                v-model="itemSearch[field.name]"
                type="text"
                placeholder="Search items..."
                class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
              />

              <div
                v-if="itemsLoading[field.name]"
                class="text-sm text-gray-400"
              >
                Loading items...
              </div>
              <div
                v-else-if="itemsError[field.name]"
                class="text-sm text-rose-400"
              >
                Error loading items: {{ itemsError[field.name] }}
              </div>
              <div v-else class="max-h-60 overflow-y-auto space-y-1">
                <label
                  v-for="item in filteredItems(field.name)"
                  :key="item.id"
                  class="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="item.id"
                    v-model="formData[field.name]"
                    class="w-4 h-4 text-blue-600 bg-gray-800 border-white/10 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span class="text-sm text-gray-200">{{
                    item.media.metadata.title
                  }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <input
          v-else-if="field.type === 'date'"
          v-model="formData[field.name]"
          type="date"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? `Executing... (${elapsedTime})` : "Execute Tool" }}
        </button>
      </div>
    </form>

    <div
      class="mt-6 overflow-hidden rounded-xl border border-blue-500/30 bg-blue-900/20"
      v-if="executionLogs.length > 0"
    >
      <div
        class="flex items-center justify-between border-b border-blue-500/30 bg-blue-900/30 px-4 py-3"
      >
        <h3 class="text-sm font-semibold text-blue-200">Execution Progress</h3>
        <div class="flex items-center gap-2">
          <div class="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          <span class="text-sm font-mono text-blue-300">{{ elapsedTime }}</span>
        </div>
      </div>
      <div class="max-h-64 overflow-y-auto p-4">
        <div class="space-y-1">
          <div
            v-for="(log, index) in executionLogs"
            :key="index"
            class="text-sm font-mono text-gray-300 animate-fade-in [&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-400 [&_a]:hover:text-blue-300 [&_a]:hover:decoration-blue-300"
          >
            <span v-html="log"></span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="result"
      class="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5"
    >
      <div
        class="flex items-center justify-between border-b border-white/10 bg-gray-900/50 px-4 py-3"
      >
        <h3 class="text-sm font-semibold">Execution Result</h3>
        <span
          class="text-sm font-semibold"
          :class="result.success ? 'text-emerald-300' : 'text-rose-300'"
        >
          {{ result.success ? "✓ Success" : "✗ Error" }}
        </span>
      </div>

      <div class="space-y-3 p-4">
        <p class="font-medium text-gray-200">
          {{ result.message }}
        </p>

        <div
          v-if="result.error"
          class="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200"
        >
          <strong class="font-semibold">Error:</strong> {{ result.error }}
        </div>

        <div class="text-xs text-gray-500">
          Executed at: {{ new Date(result.timestamp).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { ToolDefinition, ToolResult } from "../types";
import { useApi } from "@/shared/composables/useApi";

interface Props {
  tool: ToolDefinition;
}

interface Library {
  id: string;
  name: string;
  mediaType: string;
  displayOrder: number;
  icon: string;
}

interface LibraryItem {
  id: string;
  media: {
    metadata: {
      title: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

const props = defineProps<Props>();

const formData = reactive<Record<string, any>>({});
const loading = ref(false);
const result = ref<ToolResult | null>(null);
const libraries = reactive<Record<string, Library[]>>({});
const librariesLoading = reactive<Record<string, boolean>>({});
const librariesError = reactive<Record<string, string | null>>({});
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);

const items = reactive<Record<string, LibraryItem[]>>({});
const itemsLoading = reactive<Record<string, boolean>>({});
const itemsError = reactive<Record<string, string | null>>({});
const selectedLibrary = reactive<Record<string, string>>({});
const itemSearch = reactive<Record<string, string>>({});

const { get, executionLogs, startExecution, stopExecution, getElapsedTime } =
  useApi();

const elapsedTime = ref("0:00");

props.tool.fields.forEach((field) => {
  if (field.type === "boolean") {
    formData[field.name] = field.default !== undefined ? field.default : false;
  } else if (field.type === "stringArray") {
    formData[field.name] = field.default || [""];
  } else if (field.type === "librarySelector") {
    formData[field.name] = [];
  } else if (field.type === "singleLibrarySelector") {
    formData[field.name] = field.default || "";
  } else if (field.type === "libraryItemsSelector") {
    formData[field.name] = [];
    selectedLibrary[field.name] = "";
    itemSearch[field.name] = "";
  } else if (field.type === "date") {
    formData[field.name] = field.default || "";
  } else {
    formData[field.name] = field.default !== undefined ? field.default : "";
  }
});

const loadLibraries = async (fieldName: string) => {
  librariesLoading[fieldName] = true;
  librariesError[fieldName] = null;

  try {
    const response = (await get("/api/libraries")).data;
    if (response.libraries) {
      libraries[fieldName] = response.libraries.sort(
        (a: Library, b: Library) => a.displayOrder - b.displayOrder,
      );

      const field = props.tool.fields.find((f) => f.name === fieldName);
      if (field?.type === "librarySelector") {
        formData[fieldName] = libraries[fieldName].map(
          (lib: Library) => lib.id,
        );
      } else if (
        field?.type === "singleLibrarySelector" &&
        !formData[fieldName] &&
        libraries[fieldName].length > 0
      ) {
        formData[fieldName] = libraries[fieldName][0].id;
      }
    }
  } catch (error: any) {
    librariesError[fieldName] = error.message || "Failed to load libraries";
  } finally {
    librariesLoading[fieldName] = false;
  }
};

const loadLibraryItems = async (fieldName: string, libraryId: string) => {
  if (!libraryId) {
    items[fieldName] = [];
    return;
  }
  itemsLoading[fieldName] = true;
  itemsError[fieldName] = null;
  try {
    const response = (await get(`/api/libraries/${libraryId}/items`)).data;
    if (response.results) {
      items[fieldName] = response.results;
    }
  } catch (error: any) {
    itemsError[fieldName] = error.message || "Failed to load items";
  } finally {
    itemsLoading[fieldName] = false;
  }
};

const filteredItems = (fieldName: string) => {
  const search = (itemSearch[fieldName] || "").toLowerCase();
  if (!search) return items[fieldName] || [];
  return (items[fieldName] || []).filter((i) =>
    i.media.metadata.title.toLowerCase().includes(search),
  );
};

const selectAllLibraries = (fieldName: string) => {
  if (libraries[fieldName]) {
    formData[fieldName] = libraries[fieldName].map((lib: Library) => lib.id);
  }
};

const deselectAllLibraries = (fieldName: string) => {
  formData[fieldName] = [];
};

const getSelectedLibrariesCount = (fieldName: string) => {
  return Array.isArray(formData[fieldName]) ? formData[fieldName].length : 0;
};

const getArrayValue = (fieldName: string): string[] => {
  if (!formData[fieldName]) formData[fieldName] = [""];
  return formData[fieldName];
};

const addArrayItem = (fieldName: string) => {
  if (!formData[fieldName]) formData[fieldName] = [];
  formData[fieldName].push("");
};

const removeArrayItem = (fieldName: string, index: number) => {
  if (formData[fieldName] && formData[fieldName].length > 1) {
    formData[fieldName].splice(index, 1);
  }
};

const handleSubmit = async () => {
  loading.value = true;
  result.value = null;
  startExecution();

  timerInterval.value = setInterval(() => {
    elapsedTime.value = getElapsedTime();
  }, 1000);

  try {
    const cleanedData: Record<string, any> = { ...formData };
    props.tool.fields.forEach((field) => {
      if (
        field.type === "stringArray" ||
        field.type === "librarySelector" ||
        field.type === "libraryItemsSelector"
      ) {
        cleanedData[field.name] = formData[field.name].filter(
          (item: string) => item.trim() !== "",
        );
      }
    });

    result.value = await props.tool.execute(cleanedData);
  } catch (error: any) {
    result.value = {
      success: false,
      message: "Tool execution failed",
      error: error.message || "Unknown error occurred",
      timestamp: new Date().toISOString(),
    };
  } finally {
    loading.value = false;
    stopExecution();

    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }
};

onMounted(() => {
  props.tool.fields.forEach((field) => {
    if (
      field.type === "librarySelector" ||
      field.type === "singleLibrarySelector" ||
      field.type === "libraryItemsSelector"
    ) {
      loadLibraries(field.name);
    }
  });
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
