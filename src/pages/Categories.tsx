"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, Fragment } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import {
  getCategoriesFromLocal,
  saveCategoriesToLocal,
  deleteCategory,
  updateCategory,
  assignTodoToCategory,
  getTodosByCategory,
  Category as LocalCategory,
} from "@/utils/localsstorage.js";
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle} from "@headlessui/react";


interface Todo {
  id: number; 
  todo: string;
  completed?: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null); // ✅ number
  const [editValue, setEditValue] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  ); // ✅ number
  const [search, setSearch] = useState<string>("");
  const [todosByCategory, setTodosByCategory] = useState<
    Record<number, Todo[]>
  >({}); // ✅ keyed by number

  const queryClient = useQueryClient();
  const allTodos: Todo[] =
    queryClient.getQueryData<{ todos: Todo[] }>(["todos"])?.todos || [];

  // ---------------- Effects ----------------
  useEffect(() => {
    (async () => {
      const saved = await getCategoriesFromLocal();
      setCategories(saved);
      await refetchTodosInCategories(saved);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Helpers ----------------
  const refetchTodosInCategories = async (
    source: LocalCategory[] = categories
  ) => {
    const map: Record<number, Todo[]> = {};
    for (const cat of source) {
      const ids: number[] = await getTodosByCategory(cat.id); // ✅ ids as numbers
      map[cat.id] = allTodos?.filter((todo) => ids.includes(todo.id)) || [];
    }
    setTodosByCategory(map);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error("Name is required");

    const exists = categories.some(
      (c) => c.name.toLowerCase() === newCategory.trim().toLowerCase()
    );
    if (exists) return toast.error("Category already exists");

    const newEntry: LocalCategory = {
      id: Date.now(), // ✅ generate number ID instead of uuid string
      name: newCategory.trim(),
    };
    const updated = [...categories, newEntry];
    await saveCategoriesToLocal(updated);
    setCategories(updated);
    setNewCategory("");
    toast.success("Category added!");
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    toast.success("Deleted category");
    await refetchTodosInCategories(updated);
  };

  const startEditing = (id: number, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleEditSubmit = async () => {
    if (!editValue.trim()) return toast.error("Name cannot be empty");
    if (editingId === null) return;

    await updateCategory(editingId, editValue.trim());

    const updated = categories.map((c) =>
      c.id === editingId ? { ...c, name: editValue.trim() } : c
    );
    setCategories(updated);
    setEditingId(null);
    setEditValue("");
    toast.success("Category updated!");
  };

  const filteredTodos: Todo[] =
    allTodos?.filter((todo) =>
      todo.todo.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-orange-50 overflow-x-hidden">
      <Navbar />

      <div className="flex flex-col lg:flex-row mt-5">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 -mt-5">
          <div className="bg-white rounded-md shadow-md p-4 sm:p-6 min-h-[calc(100vh-5rem)]">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-800">
              Create A Category
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-full sm:max-w-md">
              <Input
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCategory(e.target.value)
                }
                className="w-full"
              />

              <Button onClick={handleAddCategory} className="bg-amber-800">
                Add
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-gray-100 p-4 rounded-md flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          type="text"
                          value={editValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                          className="flex-1"
                        />

                        <Button
                          onClick={handleEditSubmit}
                          size="sm"
                          className="bg-amber-800"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-lg font-medium text-orange-800">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditing(cat.id, cat.name)}
                            className="text-orange-800"
                            aria-label="Edit category"
                          >
                            <Icon icon="mdi:pencil" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(cat.id)}
                            className="text-orange-800"
                            aria-label="Delete category"
                          >
                            <Icon icon="mdi:trash-can-outline" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className="text-orange-800"
                            aria-label="Add todo"
                          >
                            <Icon icon="mdi:plus" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {todosByCategory[cat.id]?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {todosByCategory[cat.id].map((todo) => (
                        <div
                          key={todo.id}
                          className="bg-white p-2 rounded text-sm text-orange-900 flex justify-between items-center"
                        >
                          <span>{todo.todo}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Headless UI Dialog */}
      <Transition appear show={!!selectedCategoryId} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedCategoryId(null)}
        >
          {/* Overlay */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <DialogTitle className="text-lg font-semibold text-orange-800 mb-4">
                  Select a Todo
                </DialogTitle>

                <Input
                  type="text"
                  placeholder="Search todos..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  className="mb-3"
                />

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="p-2 rounded-md bg-orange-100 cursor-pointer hover:bg-orange-200 text-sm"
                      onClick={async () => {
                        if (selectedCategoryId === null) return;
                        await assignTodoToCategory(todo.id, selectedCategoryId);
                        toast.success("Todo added to category.");
                        setSelectedCategoryId(null);
                        await refetchTodosInCategories();
                      }}
                    >
                      {todo.todo}
                    </div>
                  ))}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
