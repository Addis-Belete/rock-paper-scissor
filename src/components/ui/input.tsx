export function Input({
  value,
  onChange,
  id,
  placeholder,
  className,
  name,
  type = "text",
  max,
  min,
  disabled = false,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  max?: string;
  min?: string;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <input
      name={name}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-700 ${className}`}
      placeholder={placeholder}
      max={max}
      min={min}
      disabled={disabled}
    />
  );
}
