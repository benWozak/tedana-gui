import { useState } from "react";
import ProjectDir from "../components/ProcessSetup/ProjectDir";
import Config from "../components/ProcessSetup/Config";
import RunScript from "../components/ProcessSetup/RunScript";
import { BoldMetadata } from "../util/types";
import { useTedanaExecution } from "../util/hooks/useTedanaExecution";

function ProcessSetup() {
  const [activeStep, setActiveStep] = useState(0);
  const [validDirectory, setValidDirectory] = useState(false);
  const [directory, setDirectory] = useState<string>();
  const [metadata, setMetadata] = useState<BoldMetadata[]>();

  const { output, loading, executeTedanaCommand, killTedanaExecution } =
    useTedanaExecution();

  const steps = [
    "Working Directory",
    "Configure Script",
    "Review & Run Tedana",
    "View Output",
  ];

  function getStep(step: number) {
    switch (step) {
      case 0:
        return (
          <ProjectDir
            onSuccessCallback={(data: BoldMetadata[], path: string) => {
              setValidDirectory(true);
              setDirectory(path);
              setMetadata(data);
            }}
          />
        );
      case 1:
        return <Config metadata={metadata} directory={directory} />;
      case 2:
        return (
          <RunScript
            output={output}
            loading={loading}
            onExecute={executeTedanaCommand}
            onKill={killTedanaExecution}
          />
        );
      case 3:
      default:
        return null;
    }
  }

  function validateNextStep(step: number) {
    switch (step) {
      case 0:
        return validDirectory ? "" : "btn-disabled";
      case 1:
        return !!directory && !!metadata ? "" : "btn-disabled";
      case 2:
      case 3:
      default:
        return "";
    }
  }

  const handleNext = async () => {
    if (activeStep === 1) {
      setActiveStep(activeStep + 1);
      await executeTedanaCommand();
    } else if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="w-full p-10 container mx-auto">
      <div className="mt-10">
        {getStep(activeStep)}

        <div className="mt-8 flex justify-end gap-2">
          <button
            className={`btn btn-outlined btn-secondary ${
              activeStep === 0 ? "btn-disabled" : ""
            }`}
            onClick={() => {
              if (activeStep !== 0) {
                setActiveStep(activeStep - 1);
              }
            }}
          >
            Back
          </button>
          <button
            className={`btn btn-primary ${validateNextStep(activeStep)}`}
            disabled={loading}
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcessSetup;
