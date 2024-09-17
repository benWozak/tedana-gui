import { useState, useEffect } from 'react';
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import useStore from "../../store/useStore";

export const useTedanaExecution = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unlistenProgress = listen("tedana-progress", (event) => {
      setOutput((prev) => [...prev, event.payload as string]);
    });

    const unlistenError = listen("tedana-error", (event) => {
      setErrors((prev) => [...prev, event.payload as string]);
    });

    return () => {
      unlistenProgress.then((f) => f());
      unlistenError.then((f) => f());
    };
  }, []);

  const executeTedanaCommand = async () => {
    try {
      setLoading(true);
      setOutput([]); // Clear previous output
      setErrors([]); // Clear previous errors
      const pythonPath = localStorage.getItem("pythonPath") || "";
      const commandExecutable = useStore.getState().commandExecutable;
      const commandArgs = commandExecutable.replace(/^tedana\s/, "");

      console.log("Executing tedana with args:", commandArgs);

      const result = await invoke("run_tedana", {
        pythonPath: pythonPath,
        commandArgs: commandArgs,
      });

      console.log("Tedana execution result:", result);
      return true;
    } catch (error) {
      console.error("Error executing tedana:", error);
      setErrors((prev) => [...prev, `Error: ${error}`]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { output, errors, loading, executeTedanaCommand };
};