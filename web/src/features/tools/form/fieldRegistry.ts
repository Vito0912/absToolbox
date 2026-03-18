import type { Component } from "vue";
import type { ToolField } from "../types";
import type {
  DynamicFormActions,
  DynamicFormState,
  FieldType,
  FieldValue,
  LibraryAsyncState,
  LibraryItemsState,
  ResolvedFieldBinding,
} from "./types";
import LibraryItemsSelectorField from "../components/dynamic-form/LibraryItemsSelectorField.vue";
import LibrarySelectorField from "../components/dynamic-form/LibrarySelectorField.vue";
import SelectField from "../components/dynamic-form/SelectField.vue";
import SessionSelectorField from "../components/dynamic-form/SessionSelectorField.vue";
import StringArrayField from "../components/dynamic-form/StringArrayField.vue";
import TextField from "../components/dynamic-form/TextField.vue";
import ToggleField from "../components/dynamic-form/ToggleField.vue";

const FIELD_COMPONENTS: Record<FieldType, Component> = {
  string: TextField,
  boolean: ToggleField,
  stringArray: StringArrayField,
  select: SelectField,
  librarySelector: LibrarySelectorField,
  singleLibrarySelector: LibrarySelectorField,
  libraryItemsSelector: LibraryItemsSelectorField,
  sessionSelector: SessionSelectorField,
  date: TextField,
};

type FieldPropsFactory = (
  field: ToolField,
  state: DynamicFormState,
) => Record<string, unknown>;

const getLibraryState = (
  fieldName: string,
  state: DynamicFormState,
): LibraryAsyncState => ({
  libraries: state.libraries[fieldName] ?? [],
  loading: state.librariesLoading[fieldName] ?? false,
  error: state.librariesError[fieldName] ?? null,
});

const getItemsState = (
  fieldName: string,
  state: DynamicFormState,
): LibraryItemsState => ({
  selectedLibrary: state.selectedLibrary[fieldName] ?? "",
  itemSearch: state.itemSearch[fieldName] ?? "",
  items: state.items[fieldName] ?? [],
  loading: state.itemsLoading[fieldName] ?? false,
  error: state.itemsError[fieldName] ?? null,
});

const FIELD_PROP_FACTORIES: Partial<Record<FieldType, FieldPropsFactory>> = {
  date: () => ({
    inputType: "date",
  }),
  select: (field) => ({
    options: field.options ?? [],
  }),
  librarySelector: (field, state) => ({
    mode: "multiple",
    libraryState: getLibraryState(field.name, state),
  }),
  singleLibrarySelector: (field, state) => ({
    mode: "single",
    name: field.name,
    libraryState: getLibraryState(field.name, state),
  }),
  libraryItemsSelector: (field, state) => ({
    libraryState: getLibraryState(field.name, state),
    itemState: getItemsState(field.name, state),
  }),
};

const getBaseProps = (
  field: ToolField,
  state: DynamicFormState,
): Record<string, unknown> => {
  const modelValue = state.formData[field.name];

  if (field.type === "string" || field.type === "date") {
    return {
      modelValue,
      required: field.required,
      placeholder: field.placeholder,
    };
  }

  if (field.type === "select") {
    return {
      modelValue,
      required: field.required,
    };
  }

  if (field.type === "stringArray") {
    return {
      modelValue,
      placeholder: field.placeholder,
    };
  }

  return {
    modelValue,
  };
};

const getFieldProps = (
  field: ToolField,
  state: DynamicFormState,
): Record<string, unknown> => {
  const baseProps = getBaseProps(field, state);
  const extraProps = FIELD_PROP_FACTORIES[field.type]?.(field, state) ?? {};

  return {
    ...baseProps,
    ...extraProps,
  };
};

const getFieldListeners = (
  field: ToolField,
  actions: DynamicFormActions,
): Record<string, ((value: unknown) => void) | undefined> => {
  const listeners: Record<string, ((value: unknown) => void) | undefined> = {
    "update:modelValue": (value: unknown) => {
      actions.updateFieldValue(field.name, value as FieldValue);
    },
  };

  if (field.type === "libraryItemsSelector") {
    listeners["update:selectedLibrary"] = (value: unknown) => {
      actions.updateSelectedLibrary(field.name, value as string);
    };
    listeners["update:itemSearch"] = (value: unknown) => {
      actions.updateItemSearch(field.name, value as string);
    };
    listeners.loadItems = (value: unknown) => {
      actions.loadLibraryItems(field.name, value as string);
    };
  }

  return listeners;
};

export const resolveFieldBinding = (
  field: ToolField,
  state: DynamicFormState,
  actions: DynamicFormActions,
): ResolvedFieldBinding => {
  return {
    component: FIELD_COMPONENTS[field.type] ?? TextField,
    props: getFieldProps(field, state),
    listeners: getFieldListeners(field, actions),
  };
};
