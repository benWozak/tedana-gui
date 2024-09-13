import { useState } from "react";
import ProjectDir from "../components/ProcessSetup/ProjectDir";
import Config from "../components/ProcessSetup/Config";
import { BoldMetadata } from "../util/types";

type Props = {};

function ProcessSetup({}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [validDirectory, setValidDirectory] = useState(false);
  const [directory, setDirectory] = useState<string | null>();
  const [metadata, setMetadata] = useState<BoldMetadata[]>();

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
            // onErrorCallback={(error: string) => }
          />
        );
      case 1:
        return <Config metadata={metadata} />;
      case 2:
      case 3:
      default:
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
        break;
    }
  }

  return (
    <div className="w-full p-10 container mx-auto">
      <div className="overflow-x-auto flex justify-center">
        <ul className="steps w-full min-w-144">
          {steps.map((step: string, index: number) => (
            <li
              key={index}
              data-content={
                index < activeStep ? "✓" : index === activeStep ? "!" : "?"
              }
              className={`step ${index <= activeStep ? "step-primary" : ""}`}
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
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
            onClick={() => {
              if (activeStep < steps.length - 1) {
                setActiveStep(activeStep + 1);
              }
            }}
          >
            {activeStep === steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcessSetup;
