"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { SortDirection, SortMethod, SortOption } from "@/types";

export default function SortingButton({
  option,
  sortOption,
  sortDirection,
  onClick,
}: {
  option: SortMethod;
  sortOption: SortOption;
  sortDirection: SortDirection;
  onClick: (option: SortOption) => void;
}) {
  return (
    <button
      onClick={() => onClick(option.value)}
      className={`flex items-center ${
        sortOption === option.value ? "text-blue-600" : "text-gray-600"
      }`}
    >
      {option.label}
      {sortOption === option.value && sortDirection === SortDirection.Asc ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      )}
    </button>
  );
}
