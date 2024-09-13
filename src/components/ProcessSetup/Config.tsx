import { useState, useEffect } from "react";
import { Table } from "../ui";
import { BoldMetadata, TedanaConfig } from "../../util/types";
import { formatMilliseconds } from "../../util/format";
import { CircleCheck, CircleX } from "lucide-react";

import EchoTimes from "./EchoTimes";

type Props = {
  metadata: BoldMetadata[] | undefined;
};

function Config({ metadata }: Props) {
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

  useEffect(() => {
    if (metadata && metadata.length > 0) {
      const newDataFiles = metadata.map((item) => item.nifti_file_path);
      const newEchoTimes = metadata
        .map((item) => item.echo_time || 0)
        .filter((time) => time !== 0);

      setConfig((prevConfig) => ({
        ...prevConfig,
        dataFiles: newDataFiles,
        echoTimes: newEchoTimes,
      }));
    }
  }, [metadata]);

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setConfig((prev) => ({ ...prev, [name]: value }));
  // };

  const generateCommand = () => {
    let command = "tedana";

    // Add required arguments
    command += ` -d ${config.dataFiles.join(" ")}`;
    command += ` -e ${config.echoTimes}`;

    // Add optional arguments
    if (config.outDir !== ".") command += ` --out-dir ${config.outDir}`;
    if (config.mask) command += ` --mask ${config.mask}`;
    if (config.prefix) command += ` --prefix ${config.prefix}`;
    if (config.convention) command += ` --convention ${config.convention}`;
    if (config.maskType) command += ` --masktype ${config.maskType.join(" ")}`;
    if (config.fitType) command += ` --fittype ${config.fitType}`;
    if (config.combMode) command += ` --combmode ${config.combMode}`;
    if (config.tedpca) command += ` --tedpca ${config.tedpca}`;
    if (config.tree) command += ` --tree ${config.tree}`;
    if (config.seed) command += ` --seed ${config.seed}`;
    if (config.maxit) command += ` --maxit ${config.maxit}`;
    if (config.maxrestart) command += ` --maxrestart ${config.maxrestart}`;
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

  if (!metadata) {
    return;
  }

  return (
    <div className="w-full p-10 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tedana Configuration</h1>

      <div className="mb-4">
        <Table columns={["Data Files"]} data={config.dataFiles} />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Echo Times</label>
        <div className="flex">
          <EchoTimes metadata={metadata} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2"> Metadata</label>
        <div className="flex gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Start Time</div>
              <div className="stat-value">
                {formatMilliseconds(metadata[0]?.start_time)}
              </div>
              <div className="stat-desc">milliseconds</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Delay</div>
              <div className="stat-value">
                {formatMilliseconds(metadata[0]?.delay_time)}
              </div>
              <div className="stat-desc">milliseconds</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Repetition Time</div>
              <div className="stat-value">{metadata[0]?.repetition_time}</div>
              <div className="stat-desc">milliseconds</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Slice Time Correction</div>
              <div className="stat-value">
                {metadata[0]?.slice_timing_corrected ? (
                  <CircleCheck color="green" />
                ) : (
                  <CircleX color="red" />
                )}
              </div>
              <div className="stat-desc">milliseconds</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Skull Stripped</div>
              <div className="stat-value">
                {metadata[0]?.skull_stripped ? (
                  <CircleCheck color="green" />
                ) : (
                  <CircleX color="red" />
                )}
              </div>
              <div className="stat-desc">milliseconds</div>
            </div>
          </div>
        </div>
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
