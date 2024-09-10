import { useState } from "react";
import DirectorySelector from "./DirectorySelector";
import { FolderSync } from "lucide-react";

type Props = {};

function ProjectDir({}: Props) {
  const [inputDir, setInputDir] = useState("");

  const handleInputDirSelect = (path: string) => {
    setInputDir(path);
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title">
          <h1 className="text-2xl font-bold mb-4">Directory Selection</h1>
        </div>

        <div className="flex gap-12">
          <DirectorySelector
            label="Input Directory"
            onSelect={handleInputDirSelect}
          />
        </div>
        <div className="flex justify-between mt-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Selection</h2>
            <p>Selected Project Directory: {inputDir}</p>
          </div>
          <div className="mt-8 flex gap-2">
            <button className="btn btn-outlined btn-secondary btn-disabled">
              Back
            </button>
            <button className="btn btn-primary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDir;
