import { useEffect, useRef } from "react";

interface OutputLine {
  content: string;
  isError: boolean;
}

type Props = {
  output: OutputLine[];
  loading: boolean;
  onExecute: () => Promise<boolean>;
  onKill: () => Promise<void>;
};

function RunScript({ output, loading, onExecute, onKill }: Props) {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onExecute();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4">
            {loading ? "Running Tedana" : "Tedana Execution Complete"}
            {loading && (
              <span className="loading loading-dots loading-md ml-2"></span>
            )}
          </h2>
          {loading && (
            <button onClick={onKill} className="btn btn-error btn-sm">
              Kill Process
            </button>
          )}
        </div>
        <div
          className="mockup-code h-96 overflow-y-auto overflow-x-hidden"
          ref={outputRef}
        >
          {output.map((line, index) => (
            <pre key={index} data-prefix={index + 1} className={`text-sm`}>
              <code
                style={
                  line.content.includes("RuntimeError") ||
                  line.content.includes("Execution error")
                    ? { color: "red" }
                    : line.content.includes("WARNING")
                    ? { color: "yellow" }
                    : { color: "#66cc8a" }
                }
                className={`text-wrap`}
              >
                {line.content}
              </code>
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RunScript;
