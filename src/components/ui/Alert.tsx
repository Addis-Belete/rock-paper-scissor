export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-red-700 relative w-full" role="alert">
      <span className="block sm:inline">{children}</span>
    </div>
  );
}

export function AlertDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm ${className}`}>{children}</p>;
}