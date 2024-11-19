"use client";

import { useState, useEffect } from "react";
import { v4 as getUUID } from "uuid";
import DeleteTaskModal from "@/components/todo/DeleteTaskModal";
import TaskList from "@/components/todo/TaskList";
import TaskAddEditModal from "@/components/todo/TaskAddEditModal";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Task } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TodoList() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [deleteModalTask, setDeleteModalTask] = useState<Task | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (title: string, description?: string) => {
    const dateNow = Date.now();
    const newTask: Task = {
      id: getUUID(),
      title,
      description: description || "",
      createdAt: dateNow,
      updatedAt: dateNow,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsTaskModalOpen(false);
  };

  const handleEditTask = (title: string, description?: string) => {
    if (currentTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                title,
                description: description || "",
                updatedAt: Date.now(),
              }
            : task,
        ),
      );
      setIsTaskModalOpen(false);
      setCurrentTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (deleteModalTask) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deleteModalTask.id),
      );
      setDeleteModalTask(null);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative mr-4 flex-grow">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="transform rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <PlusIcon className="inline-block h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline-block">Add Task</span>
          </button>
        </div>
        {isLoading ? (
          <LoadingSpinner className="mt-10" />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={(task) => {
              setCurrentTask(task);
              setIsTaskModalOpen(true);
            }}
            onDelete={(task) => setDeleteModalTask(task)}
          />
        )}
      </div>

      <TaskAddEditModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setCurrentTask(null);
        }}
        onSubmit={currentTask ? handleEditTask : handleAddTask}
        task={currentTask || undefined}
      />

      <DeleteTaskModal
        task={deleteModalTask}
        onClose={() => setDeleteModalTask(null)}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
