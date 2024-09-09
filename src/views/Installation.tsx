import { useCopyToClipboard } from "usehooks-ts";
import { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";

type Props = {};

function Installation({}: Props) {
  const [_, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.innerText;
      copy(text)
        .then(() => {
          console.log("Copied!", { text });
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch((error) => {
          console.error("Failed to copy!", error);
        });
    }
  };

  return (
    <main className="container w-full p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold my-4">Tedana Installation Guide </h1>

      <section className="w-4/5 my-8">
        <h2 className="text-xl font-bold mb-4">1. Install Python</h2>
        <p className="mb-4">
          Ensure you have Python 3.8 or newer installed on your system. To check
          your Python version,
        </p>
        <p className="mb-4">open a terminal and run:</p>

        <div className="mockup-code my-4 relative">
          <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
            Bash
          </div>
          <pre data-prefix="$">
            <code ref={codeRef}>python --version</code>
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
              copied ? "text-success" : ""
            }`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <p className="mt-4">
          If you need to install or update Python, visit the official Python
          website and download the appropriate version for your operating
          system.
        </p>
      </section>

      <section className="w-4/5 my-8">
        <h2 className="text-xl font-bold mb-4">
          2. Set up a Virtual Environment (Optional but Recommended)
        </h2>
        <p className="mb-4">
          It's a good practice to use a virtual environment to keep your tedana
          installation isolated from other Python projects.
        </p>

        <div className="mockup-code my-4 relative">
          <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
            Bash
          </div>
          <pre data-prefix="$">
            <code ref={codeRef}>python -m venv tedana-env</code>
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
              copied ? "text-success" : ""
            }`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <p className="mt-8">Activate the virtual environment:</p>
        <div className="pl-8">
          <p>On MacOS/Linux</p>
          <div className="mockup-code my-4 relative">
            <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
              Bash
            </div>
            <pre data-prefix="$">
              <code ref={codeRef}>source tedana-env/bin/activate</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
                copied ? "text-success" : ""
              }`}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <p>On Windows</p>
          <div className="mockup-code my-4 relative">
            <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
              Bash
            </div>
            <pre data-prefix="$">
              <code ref={codeRef}>tedana-env\Scripts\activate</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
                copied ? "text-success" : ""
              }`}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">3. Install Required Packages</h2>
        <p className="mb-4">Install the necessary dependencies using pip:</p>

        <div className="mockup-code my-4 relative">
          <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
            Bash
          </div>
          <pre data-prefix="$">
            <code ref={codeRef}>
              pip install nilearn nibabel numpy scikit-learn scipy mapca
            </code>
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
              copied ? "text-success" : ""
            }`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">4. Install Tedana</h2>

        <div className="mockup-code my-4 relative">
          <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
            Bash
          </div>
          <pre data-prefix="$">
            <code ref={codeRef}>pip install tedana</code>
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
              copied ? "text-success" : ""
            }`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">5. Verify the Installation</h2>

        <p className="mt-8">
          To confirm that tedana has been installed correctly:
        </p>
        <div className="pl-8">
          <p>Open a Python interactive shell</p>
          <div className="mockup-code my-4 relative">
            <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
              Bash
            </div>
            <pre data-prefix="$">
              <code ref={codeRef}>python</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
                copied ? "text-success" : ""
              }`}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <p>In the Python shell, try importing tedana</p>
          <div className="mockup-code my-4 relative">
            <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
              Python
            </div>
            <pre data-prefix="~">
              <code ref={codeRef}>
                <span className="text-secondary">import</span> tedana
              </code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
                copied ? "text-success" : ""
              }`}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <p className="mt-8">
          If no error occurs, tedana has been successfully installed.
        </p>
        <div className="pl-8">
          <p>Exit the Python shell</p>
          <div className="mockup-code my-4 relative">
            <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
              Python
            </div>
            <pre data-prefix="~">
              <code ref={codeRef}>exit()</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
                copied ? "text-success" : ""
              }`}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <p>Check the command-line interface</p>
          <div className="mockup-code my-4 relative">
            <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
              Bash
            </div>
            <pre data-prefix="$">
              <code ref={codeRef}>tedana --help</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
                copied ? "text-success" : ""
              }`}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        <p className="my-4">
          If you see the help message for tedana, the CLI is working correctly.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">
          6. Deactivate the Virtual Environment
        </h2>

        <p className="mb-4">
          When you're done using tedana, you can deactivate the virtual
          environment:
        </p>

        <div className="mockup-code my-4 relative">
          <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
            Bash
          </div>
          <pre data-prefix="$">
            <code ref={codeRef}>deactivate</code>
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
              copied ? "text-success" : ""
            }`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Installation;
