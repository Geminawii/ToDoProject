import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Task from "@/components/Task";
import AddTodo from "../pages/AddToDo";
import { toast } from "sonner";
import { useDrop } from "react-dnd";

async function fetchTodos() {
  const res = await fetch("https://dummyjson.com/todos");
  if (!res.ok) throw new Error("Failed to fetch todos.");
  return res.json();
}

function MainContent({ user, searchTerm, filter }) {
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const deletedRef = useRef([]);
  const completedRef = useRef([]);

  const queryClient = useQueryClient();
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { data, isError, error } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TODO",
    drop: (item) => handleDelete([item.id]),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const handleDelete = async (ids) => {
    try {
      deletedRef.current = data.todos.filter((t) => ids.includes(t.id));
      await Promise.all(
        ids.map((id) =>
          fetch(`https://dummyjson.com/todos/${id}`, { method: "DELETE" })
        )
      );
      toast.success(
        <span>
          Deleted
          <Button
            variant="link"
            onClick={async () => {
              await Promise.all(
                deletedRef.current.map((todo) =>
                  fetch(`https://dummyjson.com/todos/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(todo),
                  })
                )
              );
              toast.success("Undo successful");
              queryClient.invalidateQueries(["todos"]);
            }}
          >
            Undo
          </Button>
        </span>
      );
      queryClient.invalidateQueries(["todos"]);
      setSelectedTodos([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete todos");
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      completedRef.current = data.todos.filter((t) => selectedTodos.includes(t.id));
      await Promise.all(
        selectedTodos.map((id) =>
          fetch(`https://dummyjson.com/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true }),
          })
        )
      );
      toast.success(
        <span>
          Marked as completed
          <Button
            variant="link"
            onClick={async () => {
              await Promise.all(
                completedRef.current.map((todo) =>
                  fetch(`https://dummyjson.com/todos/${todo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...todo, completed: false }),
                  })
                )
              );
              toast.success("Undo successful");
              queryClient.invalidateQueries(["todos"]);
            }}
          >
            Undo
          </Button>
        </span>
      );
      queryClient.invalidateQueries(["todos"]);
      setSelectedTodos([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as completed");
    }
  };

  if (isError) {
    return (
      <p aria-live="assertive" className="p-6 text-orange-800">
         "Error loading todos."
      </p>
    );
  }

  const tasks = data?.todos || [];
  const uncompleted = tasks?.filter((task) => !task.completed) || [];

  const filtered = uncompleted
    .filter((task) => task.todo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    });

  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  const total = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = total - completedCount;
  const completedPercentage = total ? Math.round((completedCount / total) * 100) : 0;
  const pendingPercentage = total ? Math.round((pendingCount / total) * 100) : 0;

  const handleToggleSelect = (id) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  if (total === 0) {
    return <p className="p-6 text-orange-800">No tasks available. Why don't you create one?</p>;
  }

  return (
    <main className="p-6 max-w-4xl m-auto bg-white rounded-md shadow-md relative">
      <h1 className="text-2xl font-bold ml-10 text-orange-900 mb-2">
        Hello, {userData?.username || "You"}!
      </h1>

      <section aria-label="Uncompleted To-Dos">
        <Card className="p-6 mb-6">
          <CardHeader className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">To-Do List</h2>
            <div className="flex gap-2 items-center">
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Add Todo">
                    <Icon icon="mdi:plus" className="w-5 h-5 text-orange-700" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
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
                ref={drop}
                onClick={() => selectedTodos.length && handleDelete(selectedTodos)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer border ${
                  isOver ? "bg-red-600 text-white" : "border-red-600 text-red-600"
                }`}
                aria-label="Trash Drop Zone"
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
                    <Link
                      to={`/todos/${task.id}`}
                      className="flex-1 block hover:underline"
                    >
                      <Task task={task} index={(page - 1) * pageSize + i} />
                    </Link>
                  </div>
                ))}

                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
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
                      onClick={() => setPage(i + 1)}
                      className="text-orange-800"
                      disabled={page === i + 1}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-orange-800"
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Great Job! You've completed all tasks!</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-label="Progress Summary">
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-lg font-semibold mb-4 text-orange-800">
              Task Progress
            </h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb--2 text-orange-800">
                <span>Completed</span>
                <span>{completedPercentage}%</span>
              </div>
              <Progress value={completedPercentage} className="[&>div]:bg-orange-700 " />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-orange-800">
                <span>Pending</span>
                <span>{pendingPercentage}%</span>
              </div>
              <Progress value={pendingPercentage} className="[&>div]:bg-orange-900" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default MainContent;
