import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-700 text-white hover:from-blue-700 hover:to-primary shadow-lg hover:shadow-xl focus:ring-primary/50",
    secondary: "bg-gradient-to-r from-secondary to-blue-400 text-white hover:from-blue-400 hover:to-secondary shadow-lg hover:shadow-xl focus:ring-secondary/50",
    outline: "border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-blue-700 hover:text-white hover:border-transparent focus:ring-primary/50",
    ghost: "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-800",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-success shadow-lg hover:shadow-xl focus:ring-success/50",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-error shadow-lg hover:shadow-xl focus:ring-error/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed transform-none hover:scale-100" : "";

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], disabledClasses, className)}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;