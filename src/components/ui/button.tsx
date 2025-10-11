import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  active?: boolean;
};

export function Button({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  variant = "default",
  size = "md",
  active = false,
}: ButtonProps) {
  const baseStyles =
    "rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles =
    variant === "default"
      ? active
        ? "bg-blue-700 text-white" // active style for default variant
        : "bg-blue-500 text-white hover:bg-blue-600"
      : active
      ? "border border-blue-400 text-blue-300 bg-gray-800"
      : "border border-gray-500 text-gray-200 hover:bg-gray-700";

  const sizeStyles =
    size === "sm"
      ? "px-2 py-1 text-xs"
      : size === "lg"
      ? "px-6 py-3 text-base"
      : "px-4 py-2 text-sm"; // md by default

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </button>
  );
}
