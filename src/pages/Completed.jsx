import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

async function fetchTodos() {
  const res = await fetch("https://dummyjson.com/todos");
  if (!res.ok) throw new Error("Failed to fetch todos.");
  return res.json();
}

async function updateTodo(id, completed) {
  const res = await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("Failed to update todo.");
  return res.json();
}

function CompletedTodos() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const mutation = useMutation({
    mutationFn: ({ id, completed }) => updateTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-orange-800">
        {error?.message || "Error loading todos."}
      </p>
    );
  }

  const completed = data?.todos?.filter((task) => task.completed) || [];

  return (
    <div className="flex min-h-screen bg-amber-50">
      <div className="flex-1">
        <Navbar />

        <aside
          className={`sticky top-0 h-screen mt-5 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          } bg-white border-r shadow-sm transition-all`}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            username={userData?.username}
            email={userData?.email}
            avatar={userData?.avatar}
          />
        </aside>

        <main className="flex-1 p-6 max-w-4xl m-auto">
          <h1 className="text-2xl font-bold text-orange-900 mb-4">
            Completed To-Dos
          </h1>

          {completed.length > 0 ? (
            <ul className="space-y-2">
              {completed.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="text-green-600 text-xl"
                    />
                    <Link to={`/todos/${task.id}`} className="hover:underline">
                      {task.todo}
                    </Link>
                  </div>

                  <button
                    onClick={() =>
                      mutation.mutate({ id: task.id, completed: false })
                    }
                    className="text-red-600 hover:text-red-800"
                    title="Mark as uncompleted"
                  >
                    <Icon icon="mdi:close-circle-outline" className="text-xl" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-800">Time to get to work!</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default CompletedTodos;
