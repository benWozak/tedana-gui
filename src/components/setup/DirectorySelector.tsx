import { useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";

interface DirectorySelectorProps {
  label: string;
  onSelect: (path: string) => void;
}

function DirectorySelector({ label, onSelect }: DirectorySelectorProps) {
  const [selectedPath, setSelectedPath] = useState<string>("");

  const handleSelectDirectory = async () => {
    try {
      const homeDirPath = await homeDir();
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: homeDirPath,
      });

      if (selected && typeof selected === "string") {
        setSelectedPath(selected);
        onSelect(selected);
      }
    } catch (error) {
      console.error("Failed to open directory:", error);
    }
  };

  return (
    <div className="form-control w-full max-w-md">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="input-group flex flex-col gap-2">
        <input
          type="text"
          placeholder="Select directory"
          className="input input-bordered w-full"
          value={selectedPath}
          readOnly
        />
        <button className="btn btn-small" onClick={handleSelectDirectory}>
          Browse
        </button>
      </div>
    </div>
  );
}

export default DirectorySelector;
