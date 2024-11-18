import { Link } from "react-router-dom";

type Props = {
  tedanaStatus: string;
  isConnected: boolean;
};

function Home({ tedanaStatus, isConnected }: Props) {
  return (
    <div className="w-full px-4 container mx-auto text-center flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold my-6">
        Welcome to the Graphical User Interface for Tedana
      </h1>

      <div className="my-6 p-4 bg-base-200 rounded-lg w-128">
        <p className="mb-2">
          Tedana Status:{" "}
          <span className={isConnected ? "text-success" : "text-error"}>
            {tedanaStatus}
          </span>
        </p>
        {/* {!isChecking && !isConnected && (
          <button
            onClick={checkTedanaConnection}
            className="btn btn-sm btn-outline"
          >
            Retry Connection
          </button>
        )} */}
      </div>

      <div className="mt-8 flex flex-col justify-center items-center px-20">
        <p className="mb-6 px-32">
          TE-dependent analysis (tedana) is a Python library for de-noising
          multi-echo functional magnetic resonance imaging (fMRI) data.
        </p>

        <h2 className="text-xl font-bold mb-4">How to get started</h2>
        <div className="flex flex-col gap-4 w-full max-w-md">
          {isConnected ? (
            <Link
              to="/process"
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
                to="/environment"
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
