"use client";

import { FieldError } from "react-hook-form";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseProps {
  label: string;
  error?: FieldError;
  multiline?: boolean;
}

type TextInputProps = BaseProps &
  (
    | ({ multiline: true } & TextAreaProps)
    | ({ multiline?: false } & InputProps)
  );

export default function TextInput({
  id,
  label,
  error,
  className,
  multiline = false,
  ...rest
}: TextInputProps) {
  const inputClassName = `w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={inputClassName}
          {...(rest as TextAreaProps)}
        />
      ) : (
        <input id={id} className={inputClassName} {...(rest as InputProps)} />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
