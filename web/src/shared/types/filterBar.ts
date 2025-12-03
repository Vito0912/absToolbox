export interface FilterOption {
  value: string;
  label: string;
  description?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterBarModelValue {
  search: string;
  filters: string[];
  sortBy: string;
  sortDirection: "asc" | "desc";
}
