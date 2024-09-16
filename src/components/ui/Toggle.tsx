import React from "react";

type Props = {
  label?: string;
  name?: string;
  defaultChecked?: boolean;
  value?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Toggle = ({
  name,
  label,
  defaultChecked,
  value,
  checked,
  onChange,
}: Props) => {
  return (
    <div className="form-control w-3/5">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          name={name}
          className="toggle toggle-primary"
          defaultChecked={defaultChecked}
          onChange={onChange}
          value={value}
          checked={checked}
        />
      </label>
    </div>
  );
};
