import PythonPathDir from "../components/environmentSetup/PythonPathDir";
import EnvironmentPathDir from "../components/environmentSetup/EnvironmentPathDir";

type Props = {};

function EnvironmentSetup({}: Props) {
  return (
    <div className="w-full container mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-8">Setup Work Environment</h1>
      </div>
      <div className="flex flex-col gap-4">
        <PythonPathDir />
        <EnvironmentPathDir />
      </div>
    </div>
  );
}

export default EnvironmentSetup;
