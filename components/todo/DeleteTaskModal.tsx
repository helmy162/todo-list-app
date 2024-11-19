import { Task } from "@/types";
import { XIcon } from "lucide-react";

interface DeleteTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteTaskModal({
  task,
  onClose,
  onDelete,
}: DeleteTaskModalProps) {
  const isOpen = Boolean(task);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Delete Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="mb-4 text-gray-600">
            Are you sure you want to delete the task <span className="font-semibold">{task?.title}</span> ? This
            action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="rounded-md border border-transparent bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
