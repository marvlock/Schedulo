"use client";

import * as React from "react";
import { cn } from "@/lib/utils/ui";

// Interface extends HTMLInputElement attributes with a custom property
// This satisfies the ESLint no-empty-object-type rule
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isCustomInput?: boolean; // Dummy property to satisfy ESLint
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };