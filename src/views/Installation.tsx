import CodeSnippet from "../components/elements/CodeSnippet";

type Props = {};

function Installation({}: Props) {
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

        <CodeSnippet code="python3 --version" language="Bash" />

        <p className="mt-4">
          If you need to install or update Python,{" "}
          <a
            href="https://www.python.org/"
            target="_blank"
            className="text-primary"
          >
            visit the official Python website
          </a>{" "}
          and download the appropriate version for your operating system.
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

        <CodeSnippet code="python3 -m venv tedana-env" language="Bash" />

        <p className="mt-8">Activate the virtual environment:</p>
        <div className="pl-8">
          <p>On MacOS/Linux</p>
          <CodeSnippet code="source tedana-env/bin/activate" language="Bash" />

          <p>On Windows</p>
          <CodeSnippet code="tedana-env\Scripts\activate" language="Bash" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">3. Install Required Packages</h2>
        <p className="mb-4">Install the necessary dependencies using pip:</p>

        <CodeSnippet
          code="pip install nilearn nibabel numpy scikit-learn scipy mapca"
          language="Bash"
        />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">4. Install Tedana</h2>

        <CodeSnippet code="pip install tedana" language="Bash" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">5. Verify the Installation</h2>

        <p className="mt-8">
          To confirm that tedana has been installed correctly:
        </p>
        <div className="pl-8">
          <p>Open a Python interactive shell</p>
          <CodeSnippet code="python" language="Bash" />

          <p>In the Python shell, try importing tedana</p>
          <CodeSnippet code="import tedana" language="Python" />
        </div>

        <p className="mt-8">
          If no error occurs, tedana has been successfully installed.
        </p>
        <div className="pl-8">
          <p>Exit the Python shell</p>
          <CodeSnippet code="exit()" language="Python" />

          <p>Check the command-line interface</p>
          <CodeSnippet code="tedana --help" language="Bash" />
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

        <CodeSnippet code="deactivate" language="Bash" />
      </section>
    </main>
  );
}

export default Installation;
