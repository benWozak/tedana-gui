import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { BidsStructure } from "../util/types";
import TedanaReport from "../components/ProcessSetup/TedanaReport";

const ReportViewer = () => {
  const [directory, setDirectory] = useState<string>("");
  const [bidsStructure, setBidsStructure] = useState<BidsStructure>();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<{
    [subjectId: string]: string[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initializeViewer = async () => {
      const workingDir = localStorage.getItem("workingDirectory");
      const convention = localStorage.getItem("fileConvention");

      if (!workingDir || !convention) {
        setError(
          "Please set up your working directory in the Environment tab first"
        );
        setLoading(false);
        return;
      }

      setDirectory(workingDir);
      try {
        const structure: BidsStructure = await invoke(
          "extract_bids_structure",
          {
            path: workingDir,
            convention: convention,
          }
        );

        setBidsStructure(structure);
        setSelectedSubjects(structure.subjects.map((sub) => sub.name));
        const sessions: { [key: string]: string[] } = {};
        structure.subjects.forEach((sub) => {
          sessions[sub.name] = sub.sessions.map((ses) => ses.name);
        });
        setSelectedSessions(sessions);
      } catch (err) {
        setError(`Error loading BIDS structure: ${err}`);
      }
      setLoading(false);
    };

    initializeViewer();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!directory || !bidsStructure) {
    return (
      <div className="alert alert-info">
        No data available. Please set up your environment first.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tedana Reports</h1>
      {bidsStructure && directory && (
        <TedanaReport
          directory={directory}
          selectedSubjects={selectedSubjects}
          selectedSessions={selectedSessions}
        />
      )}
    </div>
  );
};

export default ReportViewer;
