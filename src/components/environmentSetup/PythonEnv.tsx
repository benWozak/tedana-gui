import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { CodeSnippet, Input, InfoBlock } from "../ui";
import { dirname } from "@tauri-apps/api/path";

type Props = {};

function PythonPathDir({}: Props) {
  const [pythonPath, setPythonPath] = useState<string>("");
  const [tedanaStatus, setTedanaStatus] = useState<string>("Not checked");

  const runTedanaCheck = async (path: string) => {
    setTedanaStatus("Checking...");
    try {
      const envPath = await getEnvironmentPath(path);

      const installCheck = await invoke("check_tedana_installation", {
        pythonPath: path,
        environmentPath: envPath,
      });

      const versionCheck = await invoke("run_tedana_command", {
        pythonPath: path,
        commandArgs: "--version",
      });

      setTedanaStatus(
        `Tedana version ${installCheck} installed. CLI accessible: ${versionCheck}`
      );
    } catch (error) {
      console.error("Error checking tedana:", error);
      setTedanaStatus(
        "Tedana not found. Please check your installation and Python path."
      );
    }
  };

  useEffect(() => {
    const storedPath = localStorage.getItem("pythonPath");
    if (storedPath) {
      setPythonPath(storedPath);
      runTedanaCheck(storedPath);
    }
  }, []);

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPythonPath(e.target.value);
  };

  const savePath = async () => {
    localStorage.setItem("pythonPath", pythonPath);
    const envPath = await getEnvironmentPath(pythonPath);
    localStorage.setItem("environmentPath", envPath);
    await runTedanaCheck(pythonPath);
  };

  const getEnvironmentPath = async (path: string): Promise<string> => {
    const pythonDir = await dirname(path);
    const envPath = await dirname(pythonDir);
    return envPath;
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title">
          <h1 className="text-2xl font-bold mb-4">
            Path to your local Python executable
          </h1>
        </div>
        <div>
          <Input
            type="text"
            value={pythonPath}
            onChange={handlePathChange}
            placeholder="/path/to/your/virtualenv/bin/python"
            className="max-w-lg"
          />
          <button onClick={savePath} className="btn btn-primary ml-2">
            Save and Check
          </button>
          <p>Tedana Status: {tedanaStatus}</p>
          <InfoBlock
            title="Not sure where to find your Python executable path?"
            content={
              <>
                To find the path to your Python executable in a virtual
                environment, you can run this command in your terminal:
                <CodeSnippet code="which python" language="bash" />
                This will give you the path to the Python executable in your
                activated virtual environment.
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PythonPathDir;
