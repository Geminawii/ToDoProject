import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import {
  getCategoriesFromLocal,
  saveCategoriesToLocal,
  deleteCategory,
  updateCategory,
  assignTodoToCategory,
  getTodosByCategory,
  removeTodoFromCategory,
} from "@/utils/localsstorage";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [search, setSearch] = useState("");
  const [todosByCategory, setTodosByCategory] = useState({});

  const queryClient = useQueryClient();
  const allTodos = queryClient.getQueryData(["todos"])?.todos || [];

  useEffect(() => {
    (async () => {
      const saved = await getCategoriesFromLocal();
      setCategories(saved);
      await refetchTodosInCategories(saved);
    })();
  }, []);

  const refetchTodosInCategories = async (source = categories) => {
    const map = {};
    for (const cat of source) {
      const ids = await getTodosByCategory(cat.id);
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

    const newEntry = { id: uuidv4(), name: newCategory.trim() };
    const updated = [...categories, newEntry];
    await saveCategoriesToLocal(updated);
    setCategories(updated);
    setNewCategory("");
    toast.success("Category added!");
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    toast.success("Deleted category");
    await refetchTodosInCategories(updated);
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleEditSubmit = async () => {
    if (!editValue.trim()) return toast.error("Name cannot be empty");

    await updateCategory(editingId, editValue.trim());

    const updated = categories.map((c) =>
      c.id === editingId ? { ...c, name: editValue.trim() } : c
    );
    setCategories(updated);
    setEditingId(null);
    setEditValue("");
    toast.success("Category updated!");
  };

  const filteredTodos =
    allTodos?.filter((todo) =>
      todo.todo.toLowerCase().includes(search.toLowerCase())
    ) || [];

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
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
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
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
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


      <Dialog
        open={!!selectedCategoryId}
        onOpenChange={() => setSelectedCategoryId(null)}
      >
        <DialogContent className="max-w-md w-full">
          <h2 className="text-lg font-semibold text-orange-800 mb-4">
            Select a Todo
          </h2>
          <Input
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="p-2 rounded-md bg-orange-100 cursor-pointer hover:bg-orange-200 text-sm"
                onClick={async () => {
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
