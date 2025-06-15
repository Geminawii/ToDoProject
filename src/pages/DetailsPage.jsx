import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { LoaderComp } from "../components/Loader";
import logo from "@/assets/logo.png";
import EditTodoModal from "./EditToDo";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

async function fetchTodo(id) {
  const res = await fetch(`https://dummyjson.com/todos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch todo.");
  return res.json();
}

export default function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showContent, setShowContent] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["todo", id],
    queryFn: async () => {
      const cached = queryClient
        .getQueryData(["todos"])
        ?.todos?.find((todo) => String(todo.id) === String(id));
      return cached || (await fetchTodo(id));
    },
  });

  useEffect(() => {
    if (!isFetching) {
      const timeout = setTimeout(() => setShowContent(true), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isFetching]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo.");

      await res.json();

      toast.success("Todo deleted successfully");

      queryClient.removeQueries(["todo", id]); 
      queryClient.setQueryData(["todos"], (old) => {
        if (!old) return;
        return {
          ...old,
          todos: old.todos.filter((t) => String(t.id) !== String(id)),
        };
      });

      navigate("/dashboard"); 
    } catch (err) {
      toast.error("Failed to delete todo");
      console.error(err);
    }
  };

  if (isFetching || !showContent) {
    return (
      <div
        aria-label="loading spinner"
        className="flex flex-col items-center justify-center h-screen space-y-4 bg-orange-50"
      >
        <img src={logo} alt="App Logo" className="h-72 w-auto animate-pulse" />
        <LoaderComp size={48} color="text-orange-500" />
        <span className="text-lg font-semibold text-orange-800">
          Loading task...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Todo not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="flex mt-5">
        <Sidebar />

        <main className="flex-1 p-6 -mt-5">
          <Card className="max-w-4xl mx-auto shadow-md min-h-full">
            <CardContent className="p-6 flex flex-col gap-4">
              <div>
                <Button
                  variant="link"
                  onClick={() => navigate("/dashboard")}
                  className="text-orange-800 p-0"
                >
                   Back to Dashboard
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-orange-900">
                  {data.todo}
                </h1>
                <div className="flex gap-2">
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" aria-label="Edit">
                        <Icon
                          icon="mdi:pencil"
                          className="w-5 h-5 text-orange-800"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <EditTodoModal
                        todo={data}
                        closeModal={() => setEditDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" aria-label="Delete">
                        <Icon
                          icon="mdi:trash-can-outline"
                          className="w-5 h-5 text-orange-800"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm text-center space-y-4">
                      <h2 className="text-lg font-semibold text-orange-900">
                        Delete Todo?
                      </h2>
                      <p className="text-orange-800 text-sm">
                        Are you sure you want to permanently delete this task?
                      </p>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

        
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Icon
                    icon="mdi:identifier"
                    className="text-orange-600 w-4 h-4"
                  />
                  <span>
                    <strong>ID:</strong> {data.id}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Icon
                    icon="mdi:account"
                    className="text-orange-600 w-4 h-4"
                  />
                  <span>
                    <strong>User ID:</strong> {data.userId}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Icon
                    icon={
                      data.completed ? "mdi:check-circle" : "mdi:close-circle"
                    }
                    className={`w-4 h-4 ${
                      data.completed ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span>
                    <strong>Status:</strong>{" "}
                    {data.completed ? "Completed" : "Not completed"}
                  </span>
                </li>

                {data.priority && (
                  <li className="flex items-center gap-2">
                    <Icon icon="mdi:flag" className="text-orange-600 w-4 h-4" />
                    <span>
                      <strong>Priority:</strong> {data.priority}
                    </span>
                  </li>
                )}

                {data.date && (
                  <li className="flex items-center gap-2">
                    <Icon
                      icon="mdi:calendar"
                      className="text-orange-600 w-4 h-4"
                    />
                    <span>
                      <strong>Due Date:</strong> {data.date}
                    </span>
                  </li>
                )}

                {data.description && (
                  <li className="sm:col-span-2 bg-orange-50 p-3 rounded-md border text-sm">
                    <strong>Description:</strong>
                    <p className="mt-1 text-gray-600">{data.description}</p>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
