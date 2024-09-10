import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {};

function Home({}: Props) {
  const [tedanaStatus, setTedanaStatus] = useState<string>("Checking...");
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkTedanaConnection = async () => {
    setIsChecking(true);
    setTedanaStatus("Checking...");
    try {
      const result = await invoke("run_tedana", { args: ["--version"] });
      setTedanaStatus("Connected: " + result);
    } catch (error) {
      console.error("Error checking tedana:", error);
      setTedanaStatus(
        "Not connected. Please check your installation and Python path."
      );
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkTedanaConnection();
  }, []);

  return (
    <div className="w-full px-4 container mx-auto text-center">
      <h1 className="text-3xl font-bold">
        Welcome to the Graphical User Interface for Tedana
      </h1>

      <p className="mb-4">
        Tedana Status: {tedanaStatus}
        {!isChecking && (
          <button
            onClick={checkTedanaConnection}
            className="ml-2 btn btn-sm btn-outline"
          >
            Retry
          </button>
        )}
      </p>

      <div className="mt-10 flex flex-col justify-center items-center">
        <p className="mb-4 px-32">
          {/* <span className="bg-primary text-primary-content px-1">TE</span>-
          <span className="bg-secondary text-secondary-content ">d</span>
          ependent <span className="bg-accent text-accent-content">ana</span> */}
          TE-dependant analysis (tedana)
          {/* (<span className="bg-primary text-primary-content">te</span>
          <span className="bg-secondary text-secondary-content ">d</span>
          <span className="bg-accent text-accent-content">ana</span>) */}
          is a Python library for denoising multi-echo functional magnetic
          resonance imaging (fMRI) data.
        </p>

        <h2 className="text-xl font-bold mb-4"> How to get started</h2>
        <div className="flex flex-col">
          <Link
            to="/Installation"
            className="btn btn-primary"
            aria-label="Installation Guide"
          >
            Install Tedana on your local machine
          </Link>
          <div className="divider">OR</div>
          <Link
            to="/setup"
            className="btn btn-secondary"
            aria-label="Get Started"
          >
            Setup Tedana App for processing
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
    </div>
  );
}

export default Home;
