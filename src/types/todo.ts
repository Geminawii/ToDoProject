export interface Todo {
  id: number | string;
  todo: string;
  completed: boolean;
  userId: number | string;
  priority?: "high" | "low" | "medium";
  date?: string;
  description?: string;
}
