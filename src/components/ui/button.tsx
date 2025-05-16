"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/ui";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "primary" | "secondary" | "ghost" | "link" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", size = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
            "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
            "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",
            "border border-gray-300 text-gray-700 hover:bg-gray-50": variant === "outline",
            "underline-offset-4 hover:underline text-primary": variant === "link",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-6 text-md": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };