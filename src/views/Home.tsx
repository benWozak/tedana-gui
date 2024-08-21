import { Link } from "react-router-dom";
type Props = {};

function Home({}: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold">
        Welcome to FMRIPrep Graphical User Interface
      </h1>
      <div className="mt-10 max-w-lg text-center">
        <p className="mb-4">
          fMRIPrep is a NiPreps (NeuroImaging PREProcessing toolS) application
          (www.nipreps.org) for the preprocessing of task-based and
          resting-state functional MRI (fMRI).
        </p>
        <div className="flex gap-4 justify-center items-center">
          <Link
            to="/setup"
            className="btn btn-primary"
            aria-label="Get Started"
          >
            Get Started
          </Link>
          <a
            href="https://fmriprep.org/en/stable/index.html"
            target="_blank"
            className=" btn btn-outline btn-primary"
            aria-label="View Documentation"
          >
            Documentation
          </a>
        </div>
      </div>
    </>
  );
}

export default Home;
