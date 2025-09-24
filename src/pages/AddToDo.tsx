import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LoaderComp } from "@/components/Loader";
import { toast } from "sonner";
import localforage from "localforage";
import { useQueryClient } from "@tanstack/react-query";


interface Todo {
  id: string;
  todo: string;
  completed: boolean;
  userId: number;
  date: string;
  priority: "low" | "medium" | "high" | "";
  description: string;
}


interface AddTodoProps {
  closeModal?: () => void;
}

export default function AddTodo({ closeModal }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId] = useState(1);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const newId = `local-${Date.now()}`;

      const newTodo: Todo = {
        id: newId,
        todo: title,
        completed: false,
        userId,
        date,
        priority,
        description,
      };

 
      const todos: Todo[] = (await localforage.getItem<Todo[]>("localTodos")) || [];

      todos.push(newTodo);
      await localforage.setItem("localTodos", todos);

      toast.success("Local todo successfully added.");
      queryClient.invalidateQueries({ queryKey: ["todos"] });

      closeModal?.();
    } catch (err) {
      toast.error("Failed to create.");
      console.error(err);
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
          />
        )}

        <h1 className="text-xl font-semibold text-orange-800 mb-4">
          Add New Todo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <Input
              className=""
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>

     
          <div>
            <label className="block mb-1 text-sm font-medium">Due Date</label>
            <Input
              className=""
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Priority</label>
            <div className="flex gap-3">
              {["low", "medium", "high"].map((level) => (
                <label
                  key={level}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border cursor-pointer ${
                    priority === level
                      ? `border-orange-600 bg-orange-100`
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={priority === level}
                    onChange={() =>
                      setPriority(level as "low" | "medium" | "high")
                    }
                    className="hidden"
                  />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
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
