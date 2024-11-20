import PythonEnv from "../components/environmentSetup/PythonEnv";

type Props = {};

function EnvironmentSetup({}: Props) {
  return (
    <div className="w-full container mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-8">Setup Work Environment</h1>
      </div>
      <div className="flex flex-col gap-4">
        <PythonEnv />
      </div>
    </div>
  );
}

export default EnvironmentSetup;
