import { useState } from "react";
import DirectorySelector from "./DirectorySelector";
import { InfoBlock, Alert } from "../ui";
import { invoke } from "@tauri-apps/api/tauri";
import { BidsStructure } from "../../util/types";

type Props = {
  onSuccessCallback: (result: BidsStructure, path: string) => void;
  onErrorCallback?: (error: string) => void;
};

function ProjectDir({ onSuccessCallback }: Props) {
  // const [inputDir, setInputDir] = useState("");
  const [message, setMessage] = useState<{
    type: "info" | "success" | "warning" | "error";
    content: string;
  } | null>();

  const validateBIDS = async (directoryPath: string) => {
    try {
      const result: string = await invoke("validate_bids_directory", {
        path: directoryPath,
      });
      setMessage({
        type: "success",
        content: result,
      });
      extractBidsStructure(directoryPath);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        content:
          "This directory is not BIDS-compatible. Please review your naming conventions and try again.",
      });
    }
  };

  const extractBidsStructure = async (directoryPath: string) => {
    try {
      const result: BidsStructure = await invoke("extract_bids_structure", {
        path: directoryPath,
      });

      if (Object.keys(result.subjects).length === 0) {
        setMessage({
          type: "error",
          content: "No subjects found in the specified directory.",
        });
      } else {
        onSuccessCallback(result, directoryPath);
      }
    } catch (error) {
      console.error("Error in extractBidsStructure:", error);

      if (typeof error === "string") {
        setMessage({
          type: "error",
          content: error,
        });
      } else if (error instanceof Error) {
        setMessage({
          type: "error",
          content: error.message,
        });
      } else {
        setMessage({
          type: "error",
          content: "An unknown error occurred while extracting BIDS structure.",
        });
      }
    }
  };

  const handleInputDirSelect = (path: string) => {
    validateBIDS(path);
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title">
          <h1 className="text-2xl font-bold mb-4">Directory Selection</h1>
        </div>

        <InfoBlock
          title="Directory must be BIDS compatible"
          content={
            <>
              For more information, check out{" "}
              <a
                href="https://bids.neuroimaging.io/"
                target="_blank"
                className="text-primary hover:underline"
              >
                Brain Imaging Data Structure
              </a>
            </>
          }
        />

        <div className="flex gap-12">
          <DirectorySelector
            label="Input Directory"
            onSelect={handleInputDirSelect}
          />
        </div>

        <div className="mt-4">
          <div>
            {!!message && (
              <Alert type={message.type} content={message.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDir;
