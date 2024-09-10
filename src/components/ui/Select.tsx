type Props = {
  placeholder?: string;
  options: string[];
};

export function Select({ placeholder, options }: Props) {
  return (
    <select className="select select-bordered w-full max-w-xs">
      {placeholder && (
        <option disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((option: string, index: number) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  );
}
