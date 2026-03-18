import type { AbsLibrary, AbsLibraryItemMinified } from "@vito0912/abs-ts-sdk";
import type { Component } from "vue";
import type { ToolField } from "../types";

export type FieldType = ToolField["type"];
export type FieldValue = string | boolean | string[];

export type FormDataState = Record<string, FieldValue>;

export interface DynamicFormState {
  formData: FormDataState;
  libraries: Record<string, AbsLibrary[]>;
  librariesLoading: Record<string, boolean>;
  librariesError: Record<string, string | null>;
  items: Record<string, AbsLibraryItemMinified[]>;
  itemsLoading: Record<string, boolean>;
  itemsError: Record<string, string | null>;
  selectedLibrary: Record<string, string>;
  itemSearch: Record<string, string>;
}

export interface DynamicFormActions {
  updateFieldValue: (name: string, value: FieldValue) => void;
  updateSelectedLibrary: (name: string, value: string) => void;
  updateItemSearch: (name: string, value: string) => void;
  loadLibraryItems: (name: string, libraryId: string) => void;
}

export interface LibraryAsyncState {
  libraries: AbsLibrary[];
  loading: boolean;
  error: string | null;
}

export interface LibraryItemsState {
  selectedLibrary: string;
  itemSearch: string;
  items: AbsLibraryItemMinified[];
  loading: boolean;
  error: string | null;
}

export interface ResolvedFieldBinding {
  component: Component;
  props: Record<string, unknown>;
  listeners: Record<string, ((value: unknown) => void) | undefined>;
}
