import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LoaderComp } from "@/components/Loader";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveExtendedTodo } from "../utils/localsstorage";

export default function AddTodo({ closeModal }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [userId] = useState(1); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: title,
          completed: false,
          userId,
        }),
      });

      const data = await res.json();

      const newTodo = {
        ...data,
        date,
        priority,
        description,
      };

      await saveExtendedTodo(data.id, { date, priority, description });

      toast("Todo created successfully!");

      queryClient.setQueryData(["todos"], (old) => {
        if (!old) return { todos: [newTodo] };
        return {
          ...old,
          todos: [newTodo, ...old.todos],
        };
      });

      closeModal ? closeModal() : navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to create todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-md">
      <CardContent className="p-6 relative">
        {closeModal && (
          <button
            onClick={closeModal}
            aria-label="Close"
            className="absolute top-4 right-4 text-orange-700 hover:text-orange-900"
          >
          </button>
        )}

        <h1 className="text-xl font-semibold text-orange-800 mb-4">
          Add New Todo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                      ? `border-orange-600 bg-orange-100 text-orange-${
                          level === "low"
                            ? "500"
                            : level === "medium"
                            ? "700"
                            : "900"
                        }`
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
            {loading ? <LoaderComp size={20} /> : "Create Todo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
