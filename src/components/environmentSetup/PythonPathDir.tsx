import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { CodeSnippet, Input, InfoBlock } from "../ui";

type Props = {};

function PythonPathDir({}: Props) {
  const [pythonPath, setPythonPath] = useState<string>("");
  const [tedanaStatus, setTedanaStatus] = useState<string>("Not checked");

  useEffect(() => {
    const storedPath = localStorage.getItem("pythonPath");
    if (storedPath) {
      setPythonPath(storedPath);
      checkTedanaInstallation(storedPath);
    }
  }, []);

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPythonPath(e.target.value);
  };

  const savePath = () => {
    localStorage.setItem("pythonPath", pythonPath);
    checkTedanaInstallation(pythonPath);
  };

  const checkTedanaInstallation = async (path: string) => {
    setTedanaStatus("Checking...");
    try {
      const version = await invoke("check_tedana_installation", {
        pythonPath: path,
      });
      setTedanaStatus(`Tedana version ${version} installed`);
      await runTedana(path);
    } catch (error) {
      console.error("Error checking tedana installation:", error);
      setTedanaStatus(
        "Tedana not found. Please check your installation and Python path."
      );
    }
  };

  const runTedana = async (path: string) => {
    try {
      const result = await invoke("run_tedana_command", {
        pythonPath: path,
        commandArgs: "--version",
        selectedSubjects: [],
        selectedSessions: {},
      });
      setTedanaStatus(
        (prevStatus) => `${prevStatus}. Tedana CLI accessible: ${result}`
      );
    } catch (error) {
      console.error("Error running tedana:", error);
      setTedanaStatus(
        (prevStatus) => `${prevStatus}. Error accessing Tedana CLI: ${error}`
      );
    }
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title">
          <h1 className="text-2xl font-bold mb-4">
            Path to your local Python directory
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
            title="Not sure where to find your Python environment path?"
            content={
              <>
                To find the path to your virtual environment, you can run this
                command in your terminal:
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
