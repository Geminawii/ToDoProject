import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import localforage from "localforage";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TaskItem from "@/components/TaskItem";
import AddTodo from "../pages/AddToDo";
import { toast } from "sonner";
import { useDrop } from "react-dnd";

import {
  getLocalTodos,
  deleteLocalTodo,
  updateLocalTodo,
} from "@/utils/localsstorage";

export interface Todo {
  id: string | number;
  todo: string;
  completed: boolean;
  [key: string]: any; 
}

interface MainContentProps {
  user?: string;
  searchTerm: string;
  filter: "completed" | "incomplete" | "all";
}


export async function fetchAllTodos(): Promise<{ todos: Todo[] }> {
  const res = await fetch("https://dummyjson.com/todos?limit=100");
  if (!res.ok) throw new Error("API fetch failed.");

  const data = await res.json();
  const localTodos = await getLocalTodos();
  return { todos: [...localTodos, ...data.todos] };
}

function MainContent({ user, searchTerm, filter }: MainContentProps) {
  const [page, setPage] = useState<number>(1);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedTodos, setSelectedTodos] = useState<(string | number)[]>([]);

  const queryClient = useQueryClient();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const { data, isError } = useQuery<{ todos: Todo[] }, Error>({
    queryKey: ["todos"],
    queryFn: fetchAllTodos,
  });

  const allTodos = data?.todos || [];

  allTodos.sort((a, b) => (parseInt(String(a.id)) || 0) - (parseInt(String(b.id)) || 0));

  const uncompleted = allTodos.filter((task) => !task.completed);

  const filtered = uncompleted
    .filter((task) => task.todo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    });

  // Pagination
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  // Handle select
  const handleToggleSelect = (id: string | number) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  // Handle delete
  const handleDelete = async (ids: (string | number)[]) => {
    try {
      for (const id of ids) {
        if (parseInt(String(id)) <= 150) {
          await fetch(`https://dummyjson.com/todos/${id}`, { method: "DELETE" });
        } else {
          await deleteLocalTodo(id);
        }
      }
      toast.success("Deleted.");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    }
    setSelectedTodos([]);
  };

  // Handle marking complete
  const handleMarkAsCompleted = async () => {
    try {
      for (const id of selectedTodos) {
        if (parseInt(String(id)) <= 150) {
          await fetch(`https://dummyjson.com/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true }),
          });
        } else {
          await updateLocalTodo(id, { completed: true });
        }
      }
      toast.success("Marked as completed.");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodos([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark.");
    }
  };


  const dropRef = useRef<HTMLDivElement | null>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TODO",
    drop: async (item: { id: string | number }) => {
      await handleDelete([item.id]);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));
  drop(dropRef);

  if (isError) {
    return (
      <p aria-live="assertive" className="p-6 text-orange-800">
        Error loading todos.
      </p>
    );
  }

  if (allTodos.length === 0) {
    return (
      <p className="p-6 text-orange-800 flex items-center justify-center text-lg font-extrabold">
        No tasks available just yet!
      </p>
    );
  }

  // Summary
  const total = allTodos.length;
  const completedCount = allTodos.filter((task) => task.completed).length;
  const pendingCount = total - completedCount;
  const completedPercentage = total ? Math.round((completedCount / total) * 100) : 0;
  const pendingPercentage = total ? Math.round((pendingCount / total) * 100) : 0;

  return (
    <main className="p-4 bg-white rounded-md shadow-md relative w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-orange-900 mb-4 ml-2 sm:ml-10">
        Hello, {userData?.username || "You"}!
      </h1>

      <section aria-label="Uncompleted To-Dos">
        <Card className="p-4 mb-6">
          <CardHeader className="flex flex-col sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg font-semibold">To-Do List</h2>
            <div className="flex gap-2 items-start">
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Add Todo"
                    className=""
                  >
                    <Icon icon="mdi:plus" className="w-5 h-5 text-orange-700" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AddTodo closeModal={() => setIsAddOpen(false)} />
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleMarkAsCompleted}
                variant="ghost"
                size="icon"
                aria-label="Mark as Completed"
                className="text-amber-700"
              >
                <Icon icon="mdi:check-bold" className="w-5 h-5" />
              </Button>

              <div
                ref={dropRef}
                onClick={() => selectedTodos.length && handleDelete(selectedTodos)}
                aria-label="Drop here to delete"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer border ${
                  isOver ? "bg-red-600 text-white" : "border-red-600 text-red-600"
                }`}
              >
                <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {paginated.length > 0 ? (
              <>
                {paginated.map((task, i) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-2 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(task.id)}
                      onChange={() => handleToggleSelect(task.id)}
                      className="accent-orange-700"
                    />
                    <Link to={`/todos/${task.id}`} className="flex-1 block hover:underline">
                      <TaskItem
                        task={task}
                        index={(page - 1) * pageSize + i}
                        isLocal={parseInt(String(task.id)) > 150}
                      />
                    </Link>
                  </div>
                ))}

                <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="default"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-orange-800"
                  >
                    Prev
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="default"
                      onClick={() => setPage(i + 1)}
                      className="text-orange-800"
                      disabled={page === i + 1}
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="default"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-orange-800"
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Great Job! You've completed all tasks.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-label="Progress Summary">
        <Card className="p-4 sm:p-6">
          <CardHeader>
            <h2 className="text-lg font-semibold mb-4 text-orange-800">
              Task Progress
            </h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-orange-800">
                <span>Completed</span>
                <span>{completedPercentage}%</span>
              </div>
              <Progress value={completedPercentage} />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-orange-800">
                <span>Pending</span>
                <span>{pendingPercentage}%</span>
              </div>
              <div className="[&>div]:bg-orange-900">
                <Progress value={pendingPercentage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default MainContent;
