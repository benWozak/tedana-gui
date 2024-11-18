import { useState, useEffect } from "react";
import DirectorySelector from "./DirectorySelector";
import { InfoBlock, Alert, Input } from "../ui";
import { invoke } from "@tauri-apps/api/tauri";
import { BidsStructure } from "../../util/types";

type Props = {
  onSuccessCallback: (
    result: BidsStructure,
    path: string,
    convention: string
  ) => void;
  onErrorCallback?: (error: string) => void;
};

function ProjectDir({ onSuccessCallback }: Props) {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [conventionString, setConventionString] = useState<string>("bold");
  const [message, setMessage] = useState<{
    type: "info" | "success" | "warning" | "error";
    content: string;
  } | null>();

  useEffect(() => {
    const workingDirectory = localStorage.getItem("workingDirectory");
    const fileConvention = localStorage.getItem("fileConvention");
    if (workingDirectory) setSelectedPath(workingDirectory);
    if (fileConvention) setConventionString(fileConvention);
  }, []);

  const validateBIDS = async () => {
    if (!selectedPath || !conventionString) {
      setMessage({
        type: "error",
        content: "Please select a directory and enter a file convention.",
      });
      return;
    }

    try {
      const result: string = await invoke("validate_bids_directory", {
        path: selectedPath,
        convention: conventionString,
      });
      setMessage({
        type: "success",
        content: result,
      });
      extractBidsStructure();
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        content:
          "This directory is not BIDS-compatible or doesn't match the given convention. Please review your naming conventions and try again.",
      });
    }
  };

  const extractBidsStructure = async () => {
    try {
      const result: BidsStructure = await invoke("extract_bids_structure", {
        path: selectedPath,
        convention: conventionString,
      });

      if (Object.keys(result.subjects).length === 0) {
        setMessage({
          type: "error",
          content: "No subjects found in the specified directory.",
        });
      } else {
        savePath();
        onSuccessCallback(result, selectedPath, conventionString);
      }
    } catch (error) {
      console.error("Error in extractBidsStructure:", error);
      setMessage({
        type: "error",
        content: "An error occurred while extracting BIDS structure.",
      });
    }
  };

  const savePath = () => {
    localStorage.setItem("workingDirectory", selectedPath);
    localStorage.setItem("fileConvention", conventionString);
  };

  const handleInputDirSelect = (path: string) => {
    setSelectedPath(path);
  };

  const handleConventionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConventionString(e.target.value);
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-2xl font-bold mb-4">Directory Selection</h2>
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
            path={localStorage.getItem("workingDirectory")}
          />
        </div>

        <div className="mt-4 w-full">
          <div className="mt-4">
            <h3 className="text-xl mb-2">File convention</h3>
            <Input
              type="text"
              placeholder="e.g., flirtboldStcMcf"
              value={conventionString}
              onChange={handleConventionChange}
            />
          </div>
          <InfoBlock
            fullWidth
            title="What is the naming convention for the files to look for?"
            content={
              <>
                <p>
                  Tedana must be called in the context of a larger ME-EPI
                  preprocessing pipeline. Two common pipelines which support
                  ME-EPI processing include{" "}
                  <a
                    href="https://fmriprep.org/en/stable/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    fMRIPrep
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://afni.nimh.nih.gov/pub/dist/doc/program_help/afni_proc.py.html"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    afni_proc.py
                  </a>
                  .
                </p>
                <p className="mt-4">
                  Tedana-GUI will look for files that include the text{" "}
                  <i className="text-secondary">"_echo-[1...5]-"</i> plus the
                  input you include below.
                </p>
                <p>
                  For example, if your file looked like this:{" "}
                  <i className="text-secondary">
                    sub-1973002P_ses-3_task_echo-1_flirtboldStcMcf.nii.gz
                  </i>
                  , you would enter "flirtboldStcMcf" in the input above.
                </p>
              </>
            }
          />
          <div className="flex justify-between">
            <button
              className="btn btn-primary mt-4"
              onClick={validateBIDS}
              disabled={!selectedPath || !conventionString}
            >
              Validate & Extract
            </button>
            <div className="w-full max-w-xl">
              {!!message && (
                <Alert type={message.type} content={message.content} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDir;
