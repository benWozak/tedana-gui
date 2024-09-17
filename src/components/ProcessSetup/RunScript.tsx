import { useEffect } from "react";

type Props = {
  output: string[];
  errors: string[];
  loading: boolean;
  onExecute: () => Promise<boolean>;
};

function RunScript({ output, errors, loading, onExecute }: Props) {
  useEffect(() => {
    onExecute();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        {loading ? "Running Tedana" : "Tedana Execution Complete"}
        {loading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : null}
      </h2>

      {errors.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-red-600">Errors:</h3>
          <div className="bg-red-100 p-2 rounded">
            {errors.map((line, index) => (
              <p key={index} className="text-sm text-red-700">
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div id="output-container" className="h-64 overflow-auto">
          <h3 className="text-lg font-bold">Output:</h3>
          <div className="bg-white p-2 rounded">
            {output.map((line, index) => (
              <p key={index} className="text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RunScript;
