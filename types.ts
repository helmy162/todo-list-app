export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}
