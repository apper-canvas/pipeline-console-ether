import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary text-white shadow-md hover:shadow-lg border-transparent",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    ghost: "text-secondary hover:text-primary hover:bg-slate-100 border-transparent",
    success: "bg-gradient-to-r from-success to-emerald-600 hover:from-emerald-700 hover:to-success text-white shadow-md hover:shadow-lg border-transparent",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-700 hover:to-error text-white shadow-md hover:shadow-lg border-transparent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    default: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      whileHover={!disabled ? { y: -1 } : {}}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;