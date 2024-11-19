"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { v4 as getUUID } from "uuid";
import DeleteTaskModal from "@/components/todo/DeleteTaskModal";
import TaskList from "@/components/todo/TaskList";
import TaskAddEditModal from "@/components/todo/TaskAddEditModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import SortingButton from "@/components/todo/SortingButton";
import { PlusIcon, SearchIcon } from "lucide-react";
import { checkType } from "@/utils/checkType";
import { SortDirection, SortMethod, SortOption, Task } from "@/types";

export default function TodoList() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [deleteModalTask, setDeleteModalTask] = useState<Task | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.CreatedAt,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc,
  );

  const SORT_METHODS: SortMethod[] = [
    { label: "Created At", value: SortOption.CreatedAt },
    { label: "Updated At", value: SortOption.UpdatedAt },
    { label: "Title", value: SortOption.Title },
  ];

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedSortOption = localStorage.getItem("sortOption") as SortOption;
    const storedSortDirection = localStorage.getItem(
      "sortDirection",
    ) as SortDirection;

    storedTasks && setTasks(JSON.parse(storedTasks));

    storedSortOption &&
      checkType(SortOption, storedSortOption) &&
      setSortOption(storedSortOption);

    storedSortDirection &&
      checkType(SortDirection, storedSortDirection) &&
      setSortDirection(storedSortDirection as SortDirection);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("sortOption", sortOption);
  }, [sortOption]);

  useEffect(() => {
    localStorage.setItem("sortDirection", sortDirection);
  }, [sortDirection]);

  const isDuplicate = (checkingTask: Task) =>
    tasks.some(
      (task) =>
        task.title.toLowerCase() === checkingTask.title.toLowerCase() &&
        task.id !== checkingTask.id,
    );

  const handleAddTask = (title: string, description?: string) => {
    const dateNow = Date.now();
    const newTask: Task = {
      id: getUUID(),
      title,
      description: description || "",
      createdAt: dateNow,
      updatedAt: dateNow,
    };
    if (isDuplicate(newTask)) {
      toast.error("A task with the same title already exists");
      return false;
    }
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsTaskModalOpen(false);
    return true;
  };

  const handleEditTask = (title: string, description?: string) => {
    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        title,
        description: description || "",
        updatedAt: Date.now(),
      };
      if (isDuplicate(updatedTask)) {
        toast.error("A task with the same title already exists");
        return false;
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTask.id ? updatedTask : task,
        ),
      );
      setIsTaskModalOpen(false);
      setCurrentTask(null);
    }
    return true;
  };

  const handleDeleteTask = () => {
    if (deleteModalTask) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deleteModalTask.id),
      );
      setDeleteModalTask(null);
    }
  };

  const filterFunction = (task: Task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortFunction = (a: Task, b: Task) => {
    if (sortOption === SortOption.Title) {
      return sortDirection === SortDirection.Asc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      return sortDirection === SortDirection.Asc
        ? a[sortOption] - b[sortOption]
        : b[sortOption] - a[sortOption];
    }
  };

  const sortedAndFilteredTasks = useMemo(() => {
    return tasks.filter(filterFunction).sort(sortFunction);
  }, [tasks, searchTerm, sortOption, sortDirection]);

  const handleSort = (option: SortOption) => {
    if (option === sortOption) {
      setSortDirection(
        sortDirection === SortDirection.Asc
          ? SortDirection.Desc
          : SortDirection.Asc,
      );
    } else {
      setSortOption(option);
      setSortDirection(SortDirection.Desc);
    }
  };

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
        <div className="mb-4 flex items-center justify-end space-x-4">
          {SORT_METHODS.map((method) => (
            <SortingButton
              key={method.value}
              option={method}
              sortOption={sortOption}
              sortDirection={sortDirection}
              onClick={handleSort}
            />
          ))}
        </div>
        {isLoading ? (
          <LoadingSpinner className="mt-10" />
        ) : (
          <TaskList
            tasks={sortedAndFilteredTasks}
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
