
import localforage from "localforage";

const EXTENDED_TODOS_KEY = "extendedTodos";


export async function saveExtendedTodo(id, extraData) {
  const existing = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  existing[id] = extraData;
  await localforage.setItem(EXTENDED_TODOS_KEY, existing);
}


export async function enrichTodos(apiTodos) {
  const extended = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  return apiTodos.map((todo) => ({
    ...todo,
    ...extended[todo.id],
  }));
}

export async function removeExtendedTodo(id) {
  const existing = (await localforage.getItem(EXTENDED_TODOS_KEY)) || {};
  delete existing[id];
  await localforage.setItem(EXTENDED_TODOS_KEY, existing);
}
