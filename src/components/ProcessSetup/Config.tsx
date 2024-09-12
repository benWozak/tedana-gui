import { useState } from "react";
import { Input } from "../ui";

interface TedanaConfig {
  dataFiles: string[];
  echoTimes: string[];
  outDir: string;
  mask: string;
  prefix: string;
  convention: "orig" | "bids";
  maskType: ("dropout" | "decay" | "none")[];
  fitType: "loglin" | "curvefit";
  combMode: "t2s";
  tedpca: string | number;
  tree: string;
  seed: number;
  maxit: number;
  maxrestart: number;
  tedort: boolean;
  gscontrol: ("mir" | "gsr")[];
  noReports: boolean;
  pngCmap: string;
  verbose: boolean;
  lowmem: boolean;
  nThreads: number;
  debug: boolean;
  t2smap: string;
  mix: string;
  overwrite: boolean;
}

type Props = {};

function Config({}: Props) {
  const [config, setConfig] = useState<TedanaConfig>({
    dataFiles: [],
    echoTimes: [],
    outDir: ".",
    mask: "",
    prefix: "",
    convention: "bids",
    maskType: ["dropout"],
    fitType: "loglin",
    combMode: "t2s",
    tedpca: "aic",
    tree: "tedana_orig",
    seed: 42,
    maxit: 500,
    maxrestart: 10,
    tedort: false,
    gscontrol: [],
    noReports: false,
    pngCmap: "coolwarm",
    verbose: false,
    lowmem: false,
    nThreads: 1,
    debug: false,
    t2smap: "",
    mix: "",
    overwrite: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const generateCommand = () => {
    let command = "tedana";

    // Add required arguments
    command += ` -d ${config.dataFiles.join(" ")}`;
    command += ` -e ${config.echoTimes}`;

    // Add optional arguments
    if (config.outDir !== ".") command += ` --out-dir ${config.outDir}`;
    if (config.mask) command += ` --mask ${config.mask}`;
    if (config.prefix) command += ` --prefix ${config.prefix}`;
    command += ` --convention ${config.convention}`;
    command += ` --masktype ${config.maskType.join(" ")}`;
    command += ` --fittype ${config.fitType}`;
    command += ` --combmode ${config.combMode}`;
    command += ` --tedpca ${config.tedpca}`;
    command += ` --tree ${config.tree}`;
    command += ` --seed ${config.seed}`;
    command += ` --maxit ${config.maxit}`;
    command += ` --maxrestart ${config.maxrestart}`;
    if (config.tedort) command += " --tedort";
    if (config.gscontrol.length > 0)
      command += ` --gscontrol ${config.gscontrol.join(" ")}`;
    if (config.noReports) command += " --no-reports";
    command += ` --png-cmap ${config.pngCmap}`;
    if (config.verbose) command += " --verbose";
    if (config.lowmem) command += " --lowmem";
    command += ` --n-threads ${config.nThreads}`;
    if (config.debug) command += " --debug";
    if (config.t2smap) command += ` --t2smap ${config.t2smap}`;
    if (config.mix) command += ` --mix ${config.mix}`;
    if (config.overwrite) command += " --overwrite";

    return command;
  };

  return (
    <div className="w-full p-10 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tedana Configuration</h1>

      <div className="mb-4">
        <label className="block mb-2">Data Files (required)</label>
        <Input
          type="file"
          multiple
          onChange={(e) =>
            setConfig((prev) => ({
              ...prev,
              dataFiles: Array.from(e.target.files || []).map(
                (file) => file.name
              ),
            }))
          }
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Echo Times (required)</label>
        {/* <Input
          name="echoTimes"
          value={config.echoTimes}
          onChange={handleInputChange}
          placeholder="e.g., 15.0 39.0 63.0"
        /> */}
      </div>

      {/* <Button onClick={() => console.log(generateCommand())}>
        Generate Command
      </Button> */}

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Generated Command:</h2>
        <pre className="bg-gray-100 p-2 rounded text-wrap">
          {generateCommand()}
        </pre>
      </div>
    </div>
  );
}

export default Config;
