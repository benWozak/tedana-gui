import { useEffect } from "react";
import { TedanaConfig } from "../../util/types";
import useStore from "../../store/useStore";

type Props = {
  config: TedanaConfig;
};

const generateCommand = (config: TedanaConfig) => {
  const lines = ["tedana"];

  // Helper function to add an option
  const addOption = (flag: string, value: any) => {
    if (value && value.length) {
      if (Array.isArray(value)) {
        lines.push(`${flag} ${value.join(" ")}`);
      } else {
        lines.push(`${flag} ${value}`);
      }
    }
  };

  // Add data files
  addOption("-d", config.dataFiles.map((file) => `"${file}"`).join(" "));

  // Add echo times
  addOption("-e", config.echoTimes.join(" "));

  // Add other options
  addOption("--out-dir", `"${config.outDir}"`);
  addOption("--mask", config.mask);
  addOption("--convention", config.convention);
  addOption("--masktype", config.maskType);
  addOption("--fittype", config.fitType);
  addOption("--combmode", config.combMode);
  addOption("--tedpca", config.tedpca);
  addOption("--tree", config.tree);
  addOption("--seed", config.seed);
  addOption("--maxit", config.maxit);
  addOption("--maxrestart", config.maxrestart);
  addOption("--png-cmap", config.pngCmap);
  addOption("--n-threads", config.nThreads);

  // Add boolean flags
  if (config.tedort) lines.push("--tedort");
  if (config.noReports) lines.push("--no-reports");
  if (config.verbose) lines.push("--verbose");
  if (config.lowmem) lines.push("--lowmem");
  if (config.debug) lines.push("--debug");
  if (config.overwrite) lines.push("--overwrite");

  return lines.join(" ");
};

// const generateCommand = (config: TedanaConfig) => {
//   const lines = ["tedana \\"];

//   // Helper function to add an option
//   const addOption = (flag: string, value: any) => {
//     if (value && value.length) {
//       if (Array.isArray(value)) {
//         lines.push(`  ${flag} ${value.join(" ")} \\`);
//       } else {
//         lines.push(`  ${flag} ${value} \\`);
//       }
//     }
//   };

//   // Add data files
//   addOption("-d", config.dataFiles.join(" \\ \n \t\t "));

//   // Add echo times
//   addOption("-e", config.echoTimes.join(" "));

//   // Add other options
//   addOption("--out-dir", config.outDir);
//   addOption("--mask", config.mask);
//   addOption("--convention", config.convention);
//   addOption("--masktype", config.maskType);
//   addOption("--fittype", config.fitType);
//   addOption("--combmode", config.combMode);
//   addOption("--tedpca", config.tedpca);
//   addOption("--tree", config.tree);
//   addOption("--seed", config.seed);
//   addOption("--maxit", config.maxit);
//   addOption("--maxrestart", config.maxrestart);
//   addOption("--png-cmap", config.pngCmap);
//   addOption("--n-threads", config.nThreads);

//   // Add boolean flags
//   if (config.tedort) lines.push("  --tedort \\");
//   if (config.noReports) lines.push("  --no-reports \\");
//   if (config.verbose) lines.push("  --verbose \\");
//   if (config.lowmem) lines.push("  --lowmem \\");
//   if (config.debug) lines.push("  --debug \\");
//   if (config.overwrite) lines.push("  --overwrite \\");

//   // Remove trailing backslash from the last line
//   lines[lines.length - 1] = lines[lines.length - 1].slice(0, -2);

//   return lines.join("\n \t");
// };

const CommandDisplay = ({ config }: Props) => {
  const setCommandExecutable = useStore((state) => state.setCommandExecutable);

  useEffect(() => {
    const command = generateCommand(config);
    setCommandExecutable(command);
  }, [config]);

  return <>{generateCommand(config)}</>;
};

export default CommandDisplay;
