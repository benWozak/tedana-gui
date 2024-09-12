import { CircleHelp } from "lucide-react";
type Props = {
  title: string;
  content: React.ReactNode | string;
};

export const InfoBlock = ({ title, content }: Props) => {
  return (
    <div className="collapse bg-base-200 my-4 max-w-2xl">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium flex">
        <CircleHelp color="#66cc8a" className="mr-2" /> {title}
      </div>
      <div className="collapse-content pl-12">{content}</div>
    </div>
  );
};
