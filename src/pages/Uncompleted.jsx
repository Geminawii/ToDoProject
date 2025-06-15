function UncompletedTodos() {
  const { data, isError, error } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

  if (isError) {
    return <p>{error?.message || "Error loading todos."}</p>;
  }
  
  const uncompleted = data?.todos?.filter((task) => !task.completed) || [];

  return (
    <div className="p-6 max-w-4xl m-auto">
      <h1 className="text-2xl font-semibold mb-4">Uncompleted To-Dos</h1>
      {uncompleted.length > 0 ? (
        <ul>
          {uncompleted.map((task) => (
            <li key={task.id}>
              <Link to={`/todos/${task.id}`}>
                {task.todo}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>All tasks are completed! 🏆</p>
      )}

    </div>
  )
}

export default UncompletedTodos;
