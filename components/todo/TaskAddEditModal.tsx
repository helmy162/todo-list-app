"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/Modal";
import { Task } from "@/types";
import TextInput from "../TextInput";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => boolean;
  task?: Task;
}

const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function TaskAddEditModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description });
    } else {
      reset({ title: "", description: "" });
    }
  }, [task, reset]);

  const onSubmitForm = (data: FormData) => {
    const success = onSubmit(data.title, data.description);
    if (!task && success) {
      reset();
    }
  };

  const modalTitle = task ? "Edit Task" : "Add New Task";
  const submitButtonText = task ? "Save Changes" : "Add Task";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <TextInput
          id="title"
          label="Title"
          placeholder="Enter task title"
          error={errors.title}
          {...register("title")}
        />
        <TextInput
          id="description"
          label="Description"
          placeholder="Enter task description"
          multiline
          error={errors.description}
          {...register("description")}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </Modal>
  );
}
