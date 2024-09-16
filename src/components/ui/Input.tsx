type Props = {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  readOnly?: boolean;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({
  name,
  type,
  placeholder,
  value,
  readOnly,
  disabled,
  className,
  onChange,
}: Props) {
  return (
    <input
      name={name}
      type={type ? type : "text"}
      placeholder={placeholder ? placeholder : ""}
      className={`input input-bordered w-full ${className ? className : ""}`}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
    />
  );
}
