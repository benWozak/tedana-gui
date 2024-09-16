type Props = {
  placeholder?: string;
  options: string[];
  disabled?: boolean;
  value: string | null;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
};

export function Select({
  placeholder,
  options,
  disabled,
  value,
  onChange,
  name,
}: Props) {
  return (
    <select
      className="select select-bordered w-full max-w-xs"
      disabled={disabled}
      value={value || ""}
      onChange={!!onChange ? (e) => onChange(e) : undefined}
      name={name}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option: string, index: number) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
