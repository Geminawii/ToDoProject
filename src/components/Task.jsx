import { useDrag } from 'react-dnd';
import { useState } from 'react';
import { Icon } from '@iconify/react';

const Task = ({ task, index }) => {
  const [isComplete, setIsComplete] = useState(task.completed);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'TODO',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      onClick={() => setIsComplete((prev) => !prev)}
      className={`flex items-center justify-between p-2 mb-1 rounded-md shadow-sm w-full cursor-pointer bg-gray-100 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon
        icon="mdi:format-list-bulleted"
        className={`w-5 h-5 mr-3 ${
          isComplete ? 'text-orange-500' : 'text-orange-800'
        }`}
      />
      <span className="flex-1 font-semibold text-orange-800 text-sm">
        {task.todo}
      </span>
      <span className="text-gray-500 ml-4 font-semibold text-xs">
        #{index + 1}
      </span>
    </div>
  );
};

export default Task;
