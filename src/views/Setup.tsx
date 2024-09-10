import InputOutputDir from "../components/setup/InputOutputDir";
import PythonPathDir from "../components/setup/PythonPathDir";

type Props = {};

function Setup({}: Props) {
  return (
    <div className="w-full px-4 container mx-auto">
      <PythonPathDir />
      <div className="divider"></div>
      <InputOutputDir />
    </div>
  );
}

export default Setup;
