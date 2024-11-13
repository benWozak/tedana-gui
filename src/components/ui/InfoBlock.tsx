import { useState, useEffect } from "react";
import { CircleHelp } from "lucide-react";
type Props = {
  title: string;
  content: React.ReactNode | string;
  defaultOpen?: boolean;
  fullWidth?: boolean;
};

export const InfoBlock = ({
  title,
  content,
  defaultOpen,
  fullWidth,
}: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
    console.log("test");
  }, [defaultOpen]);
  return (
    <div
      className={`collapse collapse-arrow bg-base-200 my-4 ${
        fullWidth ? "w-full" : "max-w-2xl"
      }`}
    >
      <input
        type="checkbox"
        checked={open}
        onChange={(e) => setOpen(e.target.checked)}
      />
      <div className="collapse-title text-lg font-medium flex">
        <CircleHelp color="#66cc8a" className="mr-2" /> {title}
      </div>
      <div className="collapse-content pl-12">{content}</div>
    </div>
  );
};
