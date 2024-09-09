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
          TE-dependent analysis (tedana)is a Python library for denoising
          multi-echo functional magnetic resonance imaging (fMRI) data. tedana
          originally came about as a part of the ME-ICA pipeline, although it
          has since diverged. An important distinction is that while the ME-ICA
          pipeline originally performed both pre-processing and TE-dependent
          analysis of multi-echo fMRI data, tedana now assumes that you’re
          working with data which has been previously preprocessed.
        </p>
        <div className="flex gap-4 justify-center items-center">
          <Link
            to="/Installation"
            className="btn btn-primary"
            aria-label="Installation Guide"
          >
            Installation
          </Link>
          <Link
            to="/setup"
            className="btn btn-secondary"
            aria-label="Get Started"
          >
            Getting Started
          </Link>
          <a
            href="https://tedana.readthedocs.io/en/stable/index.html"
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
