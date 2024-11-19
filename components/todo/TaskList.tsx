import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500">No tasks found.</p>;
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="mb-2 text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(task.createdAt).toLocaleString()} - Last
                Updated at: {new Date(task.updatedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500"></p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-blue-600 transition-colors duration-300 hover:text-blue-800"
                aria-label={`Edit task: ${task.title}`}
              >
                <Edit2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="text-red-600 transition-colors duration-300 hover:text-red-800"
                aria-label={`Delete task: ${task.title}`}
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
