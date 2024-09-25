import { useState, useEffect } from "react";
import { Input, InfoBlock, CodeSnippet } from "../ui";

function EnvironmentPathDir() {
  const [environmentPath, setEnvironmentPath] = useState<string>("");
  const [useVirtualEnv, setUseVirtualEnv] = useState<boolean>(false);

  useEffect(() => {
    const storedPath = localStorage.getItem("environmentPath");
    const storedUseVirtualEnv = localStorage.getItem("useVirtualEnv");
    if (storedPath) setEnvironmentPath(storedPath);
    if (storedUseVirtualEnv) setUseVirtualEnv(storedUseVirtualEnv === "true");
  }, []);

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnvironmentPath(e.target.value);
  };

  const handleUseVirtualEnvChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseVirtualEnv(e.target.checked);
  };

  const savePath = () => {
    localStorage.setItem("environmentPath", environmentPath);
    localStorage.setItem("useVirtualEnv", useVirtualEnv.toString());
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-2xl font-bold mb-4">
            fMRIPrep/Tedana Environment Setup
          </h2>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Using a virtual environment?</span>
            <input
              type="checkbox"
              checked={useVirtualEnv}
              onChange={handleUseVirtualEnvChange}
              className="checkbox"
            />
          </label>
        </div>
        {useVirtualEnv && (
          <div>
            <Input
              type="text"
              value={environmentPath}
              onChange={handlePathChange}
              placeholder="/path/to/your/fmriprep_tedana_env"
              className="max-w-lg"
            />
            <button onClick={savePath} className="btn btn-primary ml-2">
              Save Path
            </button>
            <InfoBlock
              title="What is this path?"
              content={
                <>
                  This is the path to the directory containing your fMRIPrep and
                  Tedana environment. It's typically the directory you navigate
                  to before activating your environment. For example, if you
                  activate your environment with:
                  <CodeSnippet
                    code="source /path/to/your/fmriprep_tedana_env/bin/activate"
                    language="bash"
                  />
                  Then your environment path would be:
                  <CodeSnippet
                    code="/path/to/your/fmriprep_tedana_env"
                    language="bash"
                  />
                </>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EnvironmentPathDir;
