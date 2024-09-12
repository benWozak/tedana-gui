import { Info, CircleCheck, TriangleAlert, CircleX } from "lucide-react";

type Props = {
  type?: "info" | "success" | "warning" | "error";
  content: React.ReactNode | string;
};

export const Alert = ({ type, content }: Props) => {
  return (
    <div
      role="alert"
      className={
        type === "info"
          ? `alert alert-info`
          : type === "success"
          ? `alert alert-success`
          : type === "warning"
          ? `alert alert-warning`
          : type === "error"
          ? `alert alert-error`
          : "alert"
      }
    >
      {type === "info" && <Info />}
      {type === "success" && <CircleCheck />}
      {type === "warning" && <TriangleAlert />}
      {type === "error" && <CircleX />}
      {type === undefined && <Info color="#28ebff" />}
      <span>{content}</span>
    </div>
  );
};
