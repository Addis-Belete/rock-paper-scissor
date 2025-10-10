import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset" | undefined;
};

export function Button({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  variant = "default",
  size = "md",
}: ButtonProps) {
  const baseStyles = "rounded text-sm transition-colors disabled:opacity-50";

  const variantStyles =
    variant === "default"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "border border-gray-400 text-gray-200 hover:bg-gray-100";

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
