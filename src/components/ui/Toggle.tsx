import React from "react";

type Props = {
  label?: string;
  defaultChecked?: boolean;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Toggle = ({ label, defaultChecked, value, onChange }: Props) => {
  return (
    <div className="form-control w-52">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          defaultChecked={defaultChecked}
          onChange={onChange}
          value={value}
        />
      </label>
    </div>
  );
};
