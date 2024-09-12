import PythonPathDir from "../components/environmentSetup/PythonPathDir";

type Props = {};

function EnvironmentSetup({}: Props) {
  return (
    <div className="w-full p-10 container mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-8">Setup Work Environment</h1>
      </div>
      <PythonPathDir />
    </div>
  );
}

export default EnvironmentSetup;
