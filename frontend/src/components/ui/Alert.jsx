import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const Alert = ({ title, description, type = "info", className = "", children }) => {
  const alertStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-500",
    success: "bg-green-100 text-green-800 border-green-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    danger: "bg-red-100 text-red-800 border-red-500",
    destructive: "bg-red-100 text-red-800 border-red-500",
    default: "bg-blue-100 text-blue-800 border-blue-500"
  };

  // Map variant to type for compatibility
  const getTypeFromVariant = (variant) => {
    if (variant === "destructive") return "danger";
    if (variant === "default") return "info";
    return variant || type;
  };

  // If variant is provided, use that to determine type
  const effectiveType = getTypeFromVariant(type);
  
  // Get icon based on type
  const getIcon = () => {
    switch(effectiveType) {
      case 'danger':
      case 'destructive':
        return <AlertCircle className="h-4 w-4 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md shadow-md ${alertStyles[effectiveType]} ${className}`}
      role="alert"
    >
      {/* If children are provided, render them */}
      {children ? (
        <div className="flex items-start gap-2">
          {getIcon()}
          <div>{children}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {title && (
            <div className="flex items-center gap-2">
              {getIcon()}
              <AlertTitle>{title}</AlertTitle>
            </div>
          )}
          {description && (
            <div className="flex items-start gap-2">
              {title ? <div className="w-4"></div> : getIcon()}
              <AlertDescription>{description}</AlertDescription>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AlertTitle = ({ children }) => {
  return <strong className="block font-bold text-lg">{children}</strong>;
};

const AlertDescription = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};

export { Alert, AlertTitle, AlertDescription };