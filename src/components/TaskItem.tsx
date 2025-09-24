import React from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";

interface TaskData {
  id: string | number;
  todo: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
}

interface TaskProps {
  task: TaskData;
  index: number;
  onToggleComplete?: (id: string | number) => void;
  onEditTask?: (task: TaskData) => void;
  onDeleteTask?: (id: string | number) => void;
  isLocal: boolean; 
}

const TaskItem: React.FC<TaskProps> = ({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  isLocal,
}) => {
  const isComplete = task.completed;


  const uniqueId =
    (typeof task.id === "number" && task.id <= 150 ? "api-" : "local-") +
    task.id;

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "TODO",
    item: { id: uniqueId },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ref = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        dragRef(node);
      }
    },
    [dragRef]
  );

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(task.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTask?.(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTask?.(task.id);
  };

  return (
    <div
      ref={ref}
      className={`flex items-center p-3 mb-2 rounded-md shadow-sm w-full cursor-grab bg-gray-100 dark:bg-gray-800 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span
        className={`font-semibold text-orange-800 dark:text-orange-200 
              text-xs sm:text-sm flex-grow 
              max-w-32 sm:max-w-none
              ${isComplete ? "line-through text-gray-400 dark:text-gray-500" : ""}
              overflow-hidden whitespace-nowrap text-ellipsis 
              sm:whitespace-normal sm:overflow-visible sm:text-clip`}
      >
        {task.todo}
        {isLocal && (
          <span className="ml-2 text-[10px] text-gray-500 dark:text-gray-400">
            (Local)
          </span>
        )}
      </span>

      <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold whitespace-nowrap flex-shrink-0">
        {task.priority && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              task.priority === "high"
                ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                : task.priority === "medium"
                ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                : "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
