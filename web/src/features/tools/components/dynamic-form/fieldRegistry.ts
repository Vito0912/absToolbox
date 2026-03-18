import type { Component } from "vue";
import type { ToolField } from "../../types";
import DateField from "./DateField.vue";
import LibraryItemsSelectorField from "./LibraryItemsSelectorField.vue";
import LibrarySelectorField from "./LibrarySelectorField.vue";
import SelectField from "./SelectField.vue";
import SessionSelectorField from "./SessionSelectorField.vue";
import SingleLibrarySelectorField from "./SingleLibrarySelectorField.vue";
import StringArrayField from "./StringArrayField.vue";
import TextField from "./TextField.vue";
import ToggleField from "./ToggleField.vue";

const FIELD_COMPONENTS: Record<ToolField["type"], Component> = {
  string: TextField,
  boolean: ToggleField,
  stringArray: StringArrayField,
  select: SelectField,
  librarySelector: LibrarySelectorField,
  singleLibrarySelector: SingleLibrarySelectorField,
  libraryItemsSelector: LibraryItemsSelectorField,
  sessionSelector: SessionSelectorField,
  date: DateField,
};

export const getFieldComponent = (type: ToolField["type"]): Component => {
  return FIELD_COMPONENTS[type] ?? TextField;
};
