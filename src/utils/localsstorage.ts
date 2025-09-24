import localforage from "localforage";

const EXTENDED_TODOS_KEY = "extendedTodos";
const CATEGORIES_KEY = "categories";
const LOCAL_TODOS_KEY = "localTodos";


export interface Todo {
  id: number | string;
  todo: string;
  completed: boolean;
  userId?: number;
  date?: string;
  priority?: "low" | "medium" | "high" | "";
  description?: string;
  isLocal?: boolean;
  categories?: number[];
}

export interface Category {
  id: number;
  name: string;
}

type ExtendedTodos = Record<string, Partial<Todo>>;


export async function saveExtendedTodo(
  id: number | string,
  extraData: Partial<Todo>
): Promise<void> {
  const existing: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  existing[id] = { ...existing[id], ...extraData };
  await localforage.setItem(EXTENDED_TODOS_KEY, existing);
}

export async function enrichTodos(apiTodos: Todo[]): Promise<Todo[]> {
  const extended: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  return apiTodos.map((todo) => ({
    ...todo,
    ...extended[todo.id],
  }));
}

export async function removeExtendedTodo(id: number | string): Promise<void> {
  const existing: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  delete existing[id];
  await localforage.setItem(EXTENDED_TODOS_KEY, existing);
}

export async function assignTodoToCategory(todoId: number | string, categoryId: number): Promise<void> {
  const extended: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  const current = extended[todoId] || {};
  const updatedCategories = Array.from(new Set([...(current.categories || []), categoryId]));
  extended[todoId] = { ...current, categories: updatedCategories };
  await localforage.setItem(EXTENDED_TODOS_KEY, extended);
}

export async function getTodosByCategory(categoryId: number): Promise<number[]> {
  const extended: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  return Object.entries(extended)
    .filter(([_, data]) => data.categories?.includes(categoryId))
    .map(([id]) => parseInt(id, 10));
}

export async function getCategoriesFromLocal(): Promise<Category[]> {
  return (await localforage.getItem(CATEGORIES_KEY)) || [];
}

export async function saveCategoriesToLocal(categories: Category[]): Promise<void> {
  await localforage.setItem(CATEGORIES_KEY, categories);
}

export async function deleteCategory(id: number): Promise<void> {
  const current: Category[] = (await localforage.getItem(CATEGORIES_KEY)) || [];
  const updated = current.filter((cat) => cat.id !== id);
  await localforage.setItem(CATEGORIES_KEY, updated);

  const todos: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  for (const [todoId, data] of Object.entries(todos)) {
    if (data.categories?.includes(id)) {
      todos[todoId].categories = data.categories.filter((c) => c !== id);
    }
  }
  await localforage.setItem(EXTENDED_TODOS_KEY, todos);
}

export async function updateCategory(id: number, name: string): Promise<void> {
  const current: Category[] = (await localforage.getItem(CATEGORIES_KEY)) || [];
  const updated = current.map((cat) => (cat.id === id ? { ...cat, name } : cat));
  await localforage.setItem(CATEGORIES_KEY, updated);
}

export async function getExtendedTodo(id: number | string): Promise<Partial<Todo>> {
  const existing: ExtendedTodos = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  return existing[id] || {};
}

export async function getLocalTodos(): Promise<Todo[]> {
  return (await localforage.getItem(LOCAL_TODOS_KEY)) || [];
}

export async function getLocalTodoById(id: number | string): Promise<Todo | undefined> {
  const todos: Todo[] = (await localforage.getItem(LOCAL_TODOS_KEY)) || [];
  return todos.find((t) => t.id === id);
}

export async function addLocalTodo(todo: Todo): Promise<void> {
  const todos: Todo[] = (await localforage.getItem(LOCAL_TODOS_KEY)) || [];
  const maxId = Math.max(0, ...todos.map((t) => Number(t.id)));
  todo.id = maxId + 1;
  todo.isLocal = true;
  todos.push(todo);
  await localforage.setItem(LOCAL_TODOS_KEY, todos);
}

export async function updateLocalTodo(id: number | string, updatedFields: Partial<Todo>): Promise<void> {
  const todos: Todo[] = (await localforage.getItem(LOCAL_TODOS_KEY)) || [];
  const updatedTodos = todos.map((t) =>
    t.id === id ? { ...t, ...updatedFields } : t
  );
  await localforage.setItem(LOCAL_TODOS_KEY, updatedTodos);
}

export async function deleteLocalTodo(id: number | string): Promise<void> {
  const todos: Todo[] = (await localforage.getItem(LOCAL_TODOS_KEY)) || [];
  const updatedTodos = todos.filter((t) => t.id !== id);
  await localforage.setItem(LOCAL_TODOS_KEY, updatedTodos);
}

export async function removeTodoFromCategory(categoryId: number, todoId: number): Promise<number[]> {
  const ids = await getTodosByCategory(categoryId);
  const updated = ids.filter((id) => id !== todoId);
  localStorage.setItem(`category:${categoryId}`, JSON.stringify(updated));
  return updated;
}
