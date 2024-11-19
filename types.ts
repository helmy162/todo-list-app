export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export enum SortOption {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
}
export type SortMethod = { label: string; value: SortOption };
export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}
