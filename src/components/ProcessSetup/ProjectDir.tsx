import { useState } from "react";
import DirectorySelector from "./DirectorySelector";
import { InfoBlock, Alert } from "../ui";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {
  onSuccessCallback: () => void;
};

function ProjectDir({ onSuccessCallback }: Props) {
  const [inputDir, setInputDir] = useState("");
  const [message, setMessage] = useState<{
    type: "info" | "success" | "warning" | "error";
    content: string;
  } | null>();

  const validateBIDS = async (directoryPath: string) => {
    try {
      const result: string = await invoke("validate_bids_directory", {
        path: directoryPath,
      });
      console.log(result);
      setMessage({
        type: "success",
        content: result,
      });
      onSuccessCallback();
      extractBoldMetadata(directoryPath);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        content:
          "This directory is not BIDS-compatible. Please review your naming conventions and try again.",
      });
    }
  };

  const extractBoldMetadata = async (directoryPath: string) => {
    try {
      const result = await invoke("extract_bold_metadata", {
        path: directoryPath,
      });
      console.log(result);
      // Handle the extracted metadata
    } catch (error) {
      console.error(error);
      // Handle any errors
    }
  };

  const handleInputDirSelect = (path: string) => {
    setInputDir(path);

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
