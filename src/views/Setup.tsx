import { useState } from "react";
import DirectorySelector from "../components/setup/DirectorySelector";
import { FolderSync } from "lucide-react";

type Props = {};

function Setup({}: Props) {
  const [inputDir, setInputDir] = useState("");
  const [outputDir, setOutputDir] = useState("");

  const handleInputDirSelect = (path: string) => {
    setInputDir(path);
  };

  const handleOutputDirSelect = (path: string) => {
    setOutputDir(path);
  };

  return (
    <div className="w-full p-4 flex flex-col justify-center items-center">
      <div className="card bg-base-300 w-5/6">
        <div className="card-body">
          <div className="card-title">
            <h1 className="text-2xl font-bold mb-4">Directory Selection</h1>
          </div>

          <div className="flex gap-12">
            <DirectorySelector
              label="Input Directory"
              onSelect={handleInputDirSelect}
            />
            <div className="divider divider-horizontal">
              <div className="rounded-xl">
                <FolderSync />
              </div>
            </div>
            <DirectorySelector
              label="Output Directory"
              onSelect={handleOutputDirSelect}
            />
          </div>
          <div className="flex justify-between mt-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Confirm Selection</h2>
              <p>Selected Input Directory: {inputDir}</p>
              <p>Selected Output Directory: {outputDir}</p>
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
    </div>
  );
}

export default Setup;
