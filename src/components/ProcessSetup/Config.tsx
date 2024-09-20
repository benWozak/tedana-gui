import { useState, useEffect } from "react";
import { Table, Input, Select, Toggle, Accordion } from "../ui";
import { TedanaConfig, BidsStructure } from "../../util/types";
import CommandDisplay from "./CommandDisplay";

import EchoTimes from "./EchoTimes";
import Metadata from "./Metadata";

type Props = {
  bidsStructure: BidsStructure | undefined;
  directory: string | undefined;
  setSelectedSubjects: any;
  setSelectedSessions: any;
};

function Config({
  bidsStructure,
  directory,
  setSelectedSubjects,
  setSelectedSessions,
}: Props) {
  const metadata = bidsStructure?.metadata;
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<{
    [subjectId: number]: string[];
  }>({});

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
    if (
      bidsStructure &&
      bidsStructure.subjects.length > 0 &&
      bidsStructure.metadata.length > 0
    ) {
      // Get the first subject and session for initial data files
      const firstSubject = bidsStructure.subjects[0];
      const firstSession = firstSubject.sessions[0];

      const newDataFiles = firstSession.echo_nifti_file_paths;
      const newEchoTimes = bidsStructure.metadata
        .map((item) => item.echo_time || 0)
        .filter((time) => time !== 0);

      setConfig((prevConfig) => ({
        ...prevConfig,
        dataFiles: newDataFiles,
        echoTimes: newEchoTimes,
        outDir: directory ? `${directory}/tedana` : "",
      }));
    }
    console.log(bidsStructure);
  }, [bidsStructure, directory]);

  const handleSubjectSelection = (subjectId: number) => {
    setSelectedSubjectIds((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const handleSessionSelection = (subjectId: number, sessionName: string) => {
    setSelectedSessionIds((prev) => {
      const subjectSessions = prev[subjectId] || [];
      if (subjectSessions.includes(sessionName)) {
        return {
          ...prev,
          [subjectId]: subjectSessions.filter((name) => name !== sessionName),
        };
      } else {
        return {
          ...prev,
          [subjectId]: [...subjectSessions, sessionName],
        };
      }
    });
  };

  useEffect(() => {
    setSelectedSubjects(
      bidsStructure?.subjects
        .filter((subject) => selectedSubjectIds.includes(subject.id))
        .map((subject) => subject.name) || []
    );
    setSelectedSessions(
      Object.fromEntries(
        Object.entries(selectedSessionIds).map(([subjectId, sessionNames]) => [
          bidsStructure?.subjects.find(
            (subject) => subject.id === parseInt(subjectId)
          )?.name || "",
          sessionNames,
        ])
      )
    );
  }, [selectedSubjectIds, selectedSessionIds, bidsStructure]);

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

  if (!bidsStructure?.metadata) {
    return;
  }

  return (
    <div className="w-full p-10 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tedana Configuration</h1>

      {bidsStructure && (
        <div>
          <h2 className="text-xl font-bold mt-4 mb-2">
            Subject and Session Selection
          </h2>
          {bidsStructure.subjects.map((subject) => (
            <div key={subject.id} className="mb-2">
              <input
                type="checkbox"
                checked={selectedSubjectIds.includes(subject.id)}
                onChange={() => handleSubjectSelection(subject.id)}
              />
              <span className="ml-2 font-semibold">{subject.name}</span>

              <div className="ml-6">
                {subject.sessions.map((session) => (
                  <div key={session.name}>
                    <input
                      type="checkbox"
                      checked={selectedSessionIds[subject.id]?.includes(
                        session.name
                      )}
                      onChange={() =>
                        handleSessionSelection(subject.id, session.name)
                      }
                    />
                    <span className="ml-2">
                      {session.name || "No session specified"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
