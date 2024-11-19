import { useState } from "react";
import ProjectDir from "../components/ProcessSetup/ProjectDir";
import Config from "../components/ProcessSetup/Config";
import RunScript from "../components/ProcessSetup/RunScript";
import TedanaReport from "../components/ProcessSetup/TedanaReport";
import { BidsStructure } from "../util/types";
import { useTedanaExecution } from "../util/hooks/useTedanaExecution";

function ProcessSetup() {
  const [activeStep, setActiveStep] = useState(0);
  const [validDirectory, setValidDirectory] = useState(false);
  const [directory, setDirectory] = useState<string>();
  const [bidsStructure, setBidsStructure] = useState<BidsStructure>();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<{
    [subjectId: string]: string[];
  }>({});

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
            onSuccessCallback={(data: BidsStructure, path: string) => {
              setValidDirectory(true);
              setDirectory(path);
              setBidsStructure(data);
            }}
          />
        );
      case 1:
        return (
          <Config
            bidsStructure={bidsStructure}
            directory={directory}
            setSelectedSubjects={setSelectedSubjects}
            setSelectedSessions={setSelectedSessions}
          />
        );
      case 2:
        return (
          <RunScript
            output={output}
            loading={loading}
            onExecute={() =>
              executeTedanaCommand(selectedSubjects, selectedSessions)
            }
            onKill={killTedanaExecution}
          />
        );
      case 3:
        return (
          <TedanaReport
            directory={directory}
            selectedSubjects={selectedSubjects}
            selectedSessions={selectedSessions}
          />
        );
      default:
        return null;
    }
  }

  function validateNextStep(step: number) {
    switch (step) {
      case 0:
        return validDirectory ? "" : "btn-disabled";
      case 1:
        return !!directory && !!bidsStructure && selectedSubjects.length > 0
          ? ""
          : "btn-disabled";
      case 2:
        return loading ? "btn-disabled" : "";
      case 3:
      default:
        return "";
    }
  }

  const handleNext = async () => {
    if (activeStep === 1) {
      setActiveStep(activeStep + 1);
      await executeTedanaCommand(selectedSubjects, selectedSessions);
    } else if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="w-full pb-10 container mx-auto">
      <ul className="steps w-full mb-8">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`step ${index <= activeStep ? "step-primary" : ""}`}
          >
            {step}
          </li>
        ))}
      </ul>

      <div>
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
