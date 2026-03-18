import { onMounted, reactive, ref } from "vue";
import { useApi } from "@/shared/composables/useApi";
import type { ToolDefinition, ToolField, ToolResult } from "../../types";
import {
  AbsLibrary,
  AbsLibraryItemMinified,
  AbsLibraryItemsMinifiedPageResponse,
} from "@vito0912/abs-ts-sdk";

type FieldValue = string | boolean | string[];
type FormDataState = Record<string, FieldValue>;

interface LibrariesResponse {
  libraries?: AbsLibrary[];
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error occurred";
};

const isArrayField = (field: ToolField): boolean => {
  return (
    field.type === "stringArray" ||
    field.type === "librarySelector" ||
    field.type === "libraryItemsSelector"
  );
};

export function useDynamicFormState(tool: ToolDefinition) {
  const {
    absClient,
    executionLogs,
    startExecution,
    stopExecution,
    getElapsedTime,
  } = useApi();

  const formData = reactive<FormDataState>({});
  const loading = ref(false);
  const result = ref<ToolResult | null>(null);
  const elapsedTime = ref("0:00");
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);

  const libraries = reactive<Record<string, AbsLibrary[]>>({});
  const librariesLoading = reactive<Record<string, boolean>>({});
  const librariesError = reactive<Record<string, string | null>>({});

  const items = reactive<Record<string, AbsLibraryItemMinified[]>>({});
  const itemsLoading = reactive<Record<string, boolean>>({});
  const itemsError = reactive<Record<string, string | null>>({});
  const selectedLibrary = reactive<Record<string, string>>({});
  const itemSearch = reactive<Record<string, string>>({});

  const initializeFieldValue = (field: ToolField): FieldValue => {
    if (field.type === "boolean") {
      return typeof field.default === "boolean" ? field.default : false;
    }

    if (field.type === "stringArray") {
      return Array.isArray(field.default) ? field.default : [""];
    }

    if (
      field.type === "librarySelector" ||
      field.type === "libraryItemsSelector"
    ) {
      return [];
    }

    return typeof field.default === "string" ? field.default : "";
  };

  const initializeFormState = () => {
    tool.fields.forEach((field) => {
      formData[field.name] = initializeFieldValue(field);

      if (field.type === "libraryItemsSelector") {
        selectedLibrary[field.name] = "";
        itemSearch[field.name] = "";
      }
    });
  };

  const loadLibraries = async (fieldName: string) => {
    librariesLoading[fieldName] = true;
    librariesError[fieldName] = null;

    try {
      const response = (await absClient.libraries.list()) as LibrariesResponse;
      const loadedLibraries = [...(response.libraries ?? [])].sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
      libraries[fieldName] = loadedLibraries;

      const field = tool.fields.find(
        (currentField) => currentField.name === fieldName,
      );
      if (!field) {
        return;
      }

      if (field.type === "librarySelector") {
        formData[fieldName] = loadedLibraries.map((library) => library.id);
      }

      if (
        field.type === "singleLibrarySelector" &&
        formData[fieldName] === "" &&
        loadedLibraries.length > 0
      ) {
        formData[fieldName] = loadedLibraries[0].id;
      }
    } catch (error: unknown) {
      librariesError[fieldName] = getErrorMessage(error);
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
      const response = (await absClient.libraries.listItems(
        libraryId,
      )) as AbsLibraryItemsMinifiedPageResponse;
      items[fieldName] = response.results ?? [];
    } catch (error: unknown) {
      itemsError[fieldName] = getErrorMessage(error);
    } finally {
      itemsLoading[fieldName] = false;
    }
  };

  const updateFieldValue = (name: string, value: FieldValue) => {
    formData[name] = value;
  };

  const updateSelectedLibrary = (name: string, value: string) => {
    selectedLibrary[name] = value;
    formData[name] = [];
  };

  const updateItemSearch = (name: string, value: string) => {
    itemSearch[name] = value;
  };

  const buildCleanedData = (): FormDataState => {
    const cleanedData: FormDataState = { ...formData };

    tool.fields.forEach((field) => {
      const fieldValue = formData[field.name];
      if (isArrayField(field) && Array.isArray(fieldValue)) {
        cleanedData[field.name] = fieldValue.filter(
          (item: string) => item.trim() !== "",
        );
      }
    });

    return cleanedData;
  };

  const handleSubmit = async () => {
    loading.value = true;
    result.value = null;
    startExecution();

    timerInterval.value = setInterval(() => {
      elapsedTime.value = getElapsedTime();
    }, 1000);

    try {
      const cleanedData = buildCleanedData();
      result.value = await tool.execute(cleanedData);
    } catch (error: unknown) {
      result.value = {
        success: false,
        message: "Tool execution failed",
        error: getErrorMessage(error),
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
    initializeFormState();

    tool.fields.forEach((field) => {
      if (
        field.type === "librarySelector" ||
        field.type === "singleLibrarySelector" ||
        field.type === "libraryItemsSelector"
      ) {
        loadLibraries(field.name);
      }
    });
  });

  return {
    executionLogs,
    formData,
    handleSubmit,
    itemSearch,
    items,
    itemsError,
    itemsLoading,
    libraries,
    librariesError,
    librariesLoading,
    loadLibraryItems,
    loading,
    result,
    selectedLibrary,
    elapsedTime,
    updateFieldValue,
    updateItemSearch,
    updateSelectedLibrary,
  };
}
