import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default",
  size = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    primary: "bg-blue-100 text-primary hover:bg-blue-200",
    success: "bg-green-100 text-success hover:bg-green-200",
    warning: "bg-yellow-100 text-warning hover:bg-yellow-200",
    error: "bg-red-100 text-error hover:bg-red-200"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;