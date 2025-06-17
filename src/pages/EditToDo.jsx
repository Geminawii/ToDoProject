import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { LoaderComp } from "../components/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { updateLocalTodo, saveExtendedTodo } from "@/utils/localsstorage";
import localforage from "localforage";

export default function EditTodoModal({ todo, closeModal }) {
  const [title, setTitle] = useState(todo?.todo || "");
  const [date, setDate] = useState(todo?.date || "");
  const [priority, setPriority] = useState(todo?.priority || "medium");
  const [description, setDescription] = useState(todo?.description || "");
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  let updatedTodo = null;

  try {
    if (String(todo.id).startsWith("local-")) {
      const todos = (await localforage.getItem("localTodos")) || [];

      const idx = todos.findIndex((t) => t.id === todo.id);
      if (idx !== -1) {
        todos[idx] = {
          ...todos[idx],
          todo: title,
          date,
          priority,
          description,
        };
        await localforage.setItem("localTodos", todos);
        updatedTodo = todos[idx];
        toast.success("Local todo updated!");
      }
    } else {
      const res = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: title, date, priority, description }),
      });

      if (!res.ok) throw new Error("Failed to update todo.");

      updatedTodo = await res.json();
      toast.success("Todo updated!");
    }

    if (updatedTodo) {
      queryClient.setQueryData(['todo', todo.id], updatedTodo);
      queryClient.setQueryData(['todos'], (old) => {
        if (!old?.todos) return old;

        return {
          ...old,
          todos: old.todos.map((t) =>
            t.id === todo.id ? updatedTodo : t
          ),
        };
      });

      closeModal();
    }
  } catch (err) {
    toast.error("Failed to update todo.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="w-full max-w-md mx-auto rounded-md">
      <CardContent className="p-6 relative">
        <h1 className="text-xl font-semibold text-orange-800 mb-4">
          Edit Todo
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Due Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Priority
            </label>
            <div className="flex gap-3">
              {["low", "medium", "high"].map((level) => (
                <label
                  key={level}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border cursor-pointer ${
                    priority === level
                      ? "border-orange-600 bg-orange-100 text-orange-800"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={priority === level}
                    onChange={() => setPriority(level)}
                    className="hidden"
                  />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the task..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoaderComp size={20} /> : "Update Todo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
