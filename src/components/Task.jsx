import { useDrag } from 'react-dnd';

const Task = ({ task, index, onToggleComplete, onEditTask, onDeleteTask }) => {
  const isComplete = task.completed;

  const uniqueId = (parseInt(task.id) <= 150 ? "api-" : "local-") + task.id;

  const [{ isDragging }, dragRef] = useDrag({  
    type: 'TODO',
    item: { id: uniqueId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
  };

  return (
    <div
      ref={dragRef}
      className={`flex items-center p-3 mb-2 rounded-md shadow-sm w-full cursor-grab bg-gray-100 dark:bg-gray-800 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span
        className={`font-semibold text-orange-800 dark:text-orange-200 text-xs sm:text-sm flex-grow pr-2 sm:pr-4 ${
          isComplete ? 'line-through text-gray-400 dark:text-gray-500' : ''
        } overflow-hidden whitespace-nowrap text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip`}
      >
        {task.todo}
      </span>

 
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold whitespace-nowrap flex-shrink-0">

        {task.priority && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              task.priority === 'high'
                ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                : task.priority === 'medium'
                ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Task;
