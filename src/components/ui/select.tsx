export function Select({
  name,
  children,
  className,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  name?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select
      name={name}
      className={`px-3 py-2 border rounded border-gray-700 w-full ${className}`}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}
