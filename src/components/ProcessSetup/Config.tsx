import { useState, useEffect } from "react";
import { Table, Input, Select, Toggle } from "../ui";
import { BoldMetadata, TedanaConfig } from "../../util/types";
import CommandDisplay from "./CommandDisplay";

import EchoTimes from "./EchoTimes";
import Metadata from "./Metadata";

type Props = {
  metadata: BoldMetadata[] | undefined;
  directory: string | undefined;
};

function Config({ metadata, directory }: Props) {
  const [config, setConfig] = useState<TedanaConfig>({
    dataFiles: [],
    echoTimes: [],
    outDir: "",
    mask: "",
    prefix: "",
    convention: null,
    maskType: "",
    fitType: null,
    combMode: null,
    tedpca: null,
    tree: null,
    seed: 42,
    maxit: 500,
    maxrestart: 10,
    tedort: false,
    gscontrol: "",
    noReports: false,
    pngCmap: null,
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
        outDir: directory ? `${directory}/tedana` : "",
      }));
    }
  }, [metadata]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConfig((prev) => ({ ...prev, [name]: checked }));
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
        <Metadata metadata={metadata} />
      </div>
      <div className="mb-4">
        <label className="block">Output directory</label>
        <Input
          placeholder="path/to/output"
          name="outDir"
          value={config.outDir}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Mask</label>
        <Input
          placeholder="path/to/mask-file"
          name="mask"
          value={config.mask}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="flex gap-4">
        <div className="mb-4">
          <label className="block">Prefix</label>
          <Input
            placeholder=""
            name="prefix"
            value={config.mask}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="mb-4">
          <label className="block">Convention</label>
          <Input
            placeholder="path/to/mask-file"
            name="prefix"
            // value={config.convention}
            value="bids"
            // onChange={(e) => handleInputChange(e)}
            readOnly
            disabled
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block">Mask Type</label>
        <Select
          placeholder="Default (dropout)"
          options={["dropout", "decay", "none"]}
          name="maskType"
          value={config.maskType}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Fit Type</label>
        <Select
          placeholder="Default (loglin)"
          options={["loglin", "curvefit"]}
          name="fitType"
          value={config.fitType}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="mb-4">
        <label className="block">TEDPCA</label>
        <Select
          placeholder="Default (aic)"
          options={["aic", "mdl", "kic"]}
          name="tedpca"
          value={config.tedpca}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Decision Tree</label>
        <Select
          placeholder="Default (tedana_orig)"
          options={["tedana_orig", "meica", "minimal (not recommended)"]}
          name="tree"
          value={config.tree}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="mb-4">
        <label className="block">GS Control</label>
        <Select
          placeholder="Default (none)"
          options={["mir", "gsr", ""]}
          name="gscontrol"
          value={config.gscontrol}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="flex gap-4">
        <div className="mb-4">
          <label className="block">Seed</label>
          <Input
            type="number"
            name="seed"
            value={config.seed || 42}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block">Max Iterations</label>
          <Input
            type="number"
            name="maxit"
            value={config.maxit || 500}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block">Max Restart</label>
          <Input
            type="number"
            name="maxrestart"
            value={config.maxrestart || 10}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block">Threads</label>
          <Input
            type="number"
            name="nThreads"
            value={config.nThreads || 1}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <Toggle
          label={
            "Orthogonalize rejected/accepted components prior to denoising."
          }
          name="tedort"
          checked={config.tedort}
          onChange={handleToggleChange}
        />
        <Toggle
          label={"Creates a figures folder with static component maps"}
          name="noReports"
          checked={config.noReports}
          onChange={handleToggleChange}
        />
        <Toggle
          label={"Generate intermediate and additional files"}
          name="verbose"
          checked={config.verbose}
          onChange={handleToggleChange}
        />
        <Toggle
          label={
            "low-memory processing, including the use of IncrementalPCA. (May increase workflow duration)"
          }
          name="lowmem"
          checked={config.lowmem}
          onChange={handleToggleChange}
        />
        <Toggle
          label={"increase verbosity of terminal logs, and generate .tsv"}
          name="debug"
          checked={config.debug}
          onChange={handleToggleChange}
        />
        <Toggle
          label={"Force overwriting of files"}
          name="overwrite"
          checked={config.overwrite}
          onChange={handleToggleChange}
        />
      </div>
      {/*
            --png-cmap
            Colormap for figures

            Default: “coolwarm”

            --t2smap
            Precalculated T2* map in the same space as the input data.

            --mix
            File containing mixing matrix. If not provided, ME-PCA & ME-ICA is done.
      */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Generated Command:</h2>
        <div className="mockup-code">
          <pre data-prefix="$">
            <code>
              <CommandDisplay config={config} />
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Config;
