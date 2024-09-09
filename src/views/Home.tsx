import { Link } from "react-router-dom";
type Props = {};

function Home({}: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold">
        Welcome to the Graphical User Interface for Tedana
      </h1>
      <div className="mt-10 max-w-lg text-center">
        <p className="mb-4">
          <span className="bg-primary text-primary-content px-1">TE</span>-
          <span className="bg-secondary text-secondary-content ">d</span>
          ependent <span className="bg-accent text-accent-content">ana</span>
          lysis (<span className="bg-primary text-primary-content">te</span>
          <span className="bg-secondary text-secondary-content ">d</span>
          <span className="bg-accent text-accent-content">ana</span>)is a Python
          library for denoising multi-echo functional magnetic resonance imaging
          (fMRI) data.
        </p>

        <h2 className="text-xl font-bold mb-4"> How to get started</h2>
        <div className="flex flex-col">
          <Link
            to="/Installation"
            className="btn btn-primary"
            aria-label="Installation Guide"
          >
            Setup your Tedana Environment
          </Link>
          <div className="divider">OR</div>
          <Link
            to="/setup"
            className="btn btn-secondary"
            aria-label="Get Started"
          >
            Setup I/O Directories
          </Link>
        </div>
        <div className="flex gap-4 justify-center items-center mt-4">
          <p>
            For more information, please check out the official{" "}
            <a
              href="https://tedana.readthedocs.io/en/stable/index.html"
              target="_blank"
              className="text-primary"
              aria-label="View Documentation"
            >
              Tedana Documentation
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
