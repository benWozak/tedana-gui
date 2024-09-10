import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {};

function Home({}: Props) {
  const [tedanaStatus, setTedanaStatus] = useState<string>("Checking...");
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const checkTedanaConnection = async () => {
    setIsChecking(true);
    setTedanaStatus("Checking...");
    try {
      const pythonPath = localStorage.getItem("pythonPath");
      if (!pythonPath) {
        setTedanaStatus(
          "Python path not set. Please go to Setup to configure."
        );
        setIsConnected(false);
        return;
      }

      const result = await invoke("run_tedana", {
        pythonPath: pythonPath,
        args: ["--version"],
      });
      setTedanaStatus("Connected: " + result);
      setIsConnected(true);
    } catch (error) {
      console.error("Error checking tedana:", error);
      setTedanaStatus(
        "Not connected. Please check your installation and Python path."
      );
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkTedanaConnection();
  }, []);

  return (
    <div className="w-full px-4 container mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to the Graphical User Interface for Tedana
      </h1>

      <div className="mb-8 p-4 bg-base-200 rounded-lg">
        <p className="mb-2">
          Tedana Status:{" "}
          <span className={isConnected ? "text-success" : "text-error"}>
            {tedanaStatus}
          </span>
        </p>
        {!isChecking && !isConnected && (
          <button
            onClick={checkTedanaConnection}
            className="btn btn-sm btn-outline"
          >
            Retry Connection
          </button>
        )}
      </div>

      <div className="mt-10 flex flex-col justify-center items-center">
        <p className="mb-6 px-32">
          TE-dependent analysis (tedana) is a Python library for denoising
          multi-echo functional magnetic resonance imaging (fMRI) data.
        </p>

        <h2 className="text-xl font-bold mb-4">How to get started</h2>
        <div className="flex flex-col gap-4 w-full max-w-md">
          {isConnected ? (
            <Link
              to="/setup"
              className="btn btn-primary"
              aria-label="Get Started"
            >
              Start Processing with Tedana
            </Link>
          ) : (
            <>
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
                aria-label="Setup Tedana"
              >
                Setup Tedana App for processing
              </Link>
            </>
          )}
        </div>
        <div className="mt-8">
          <p>
            For more information, please check out the official{" "}
            <a
              href="https://tedana.readthedocs.io/en/stable/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
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
