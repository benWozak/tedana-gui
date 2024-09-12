type Props = {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
  multiple?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({
  name,
  type,
  placeholder,
  value,
  readOnly,
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
      readOnly={readOnly}
      onChange={onChange}
    />
  );
}
