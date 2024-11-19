import { useEffect, useState } from "react";
import { join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";
// import { open } from "@tauri-apps/api/shell";
import { Select } from "../ui";

type ReportOption = {
  subject: string;
  session: string;
  path: string;
};

type Props = {
  directory: string | undefined;
  selectedSubjects: string[];
  selectedSessions: { [subjectId: string]: string[] };
};

export default function TedanaReport({
  directory,
  selectedSubjects,
  selectedSessions,
}: Props) {
  const [reportOptions, setReportOptions] = useState<ReportOption[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [error, setError] = useState<string>("");

  // const openInBrowser = async () => {
  //   try {
  //     await open(selectedReport.replace("tedana:/", ""));
  //   } catch (err) {
  //     console.error("Error opening file:", err);
  //     setError("Failed to open report in browser");
  //   }
  // };

  useEffect(() => {
    const findReports = async () => {
      if (!directory) return;

      try {
        const options: ReportOption[] = [];

        for (const subject of selectedSubjects) {
          const sessions = selectedSessions[subject] || [];
          for (const session of sessions) {
            const reportPath = await join(
              directory,
              subject,
              session,
              "tedana",
              "tedana_report.html"
            );

            const reportExists = await exists(reportPath);

            if (reportExists) {
              options.push({
                subject,
                session,
                path: reportPath,
              });
            }
          }
        }

        setReportOptions(options);

        if (options.length > 0) {
          const initialPath = `tedana:/${options[0].path}`;
          setSelectedReport(initialPath);
        }
      } catch (err) {
        setError(`Error finding tedana reports: ${err}`);
      }
    };

    findReports();
  }, [directory, selectedSubjects, selectedSessions]);

  const handleReportChange = (path: string) => {
    setSelectedReport(`tedana:/${path}`);
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tedana Report Viewer</h2>
          <div className="flex gap-2 items-center">
            <Select
              name="report-select"
              value={selectedReport.replace("tedana:/", "")}
              options={reportOptions.map((option) => option.path)}
              onChange={(e) => handleReportChange(e.target.value)}
              placeholder="Select a report"
              size="2xl"
            />
            {/* <button
              onClick={openInBrowser}
              className="btn btn-square btn-primary"
              disabled={!selectedReport}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button> */}
          </div>
        </div>

        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div className="w-full h-[800px] bg-base-100 rounded-lg overflow-hidden">
            {selectedReport && (
              <iframe
                src={selectedReport}
                className="w-full h-full"
                title="Tedana Report"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
