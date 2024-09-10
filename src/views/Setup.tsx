import ProjectDir from "../components/setup/ProjectDir";
import PythonPathDir from "../components/setup/PythonPathDir";

type Props = {};

function Setup({}: Props) {
  return (
    <div className="w-full p-10 container mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-8">Setup Work Environment</h1>
      </div>
      <PythonPathDir />
      <div className="divider"></div>
      <ProjectDir />
    </div>
  );
}

export default Setup;
