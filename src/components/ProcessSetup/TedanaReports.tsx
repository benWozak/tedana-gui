import { useEffect, useState } from "react";
import { join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";

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

  useEffect(() => {
    const findReports = async () => {
      if (!directory) return;

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
        setSelectedReport(`tedana://${options[0].path}`);
      } else {
        setError(
          "No tedana reports found for the selected subjects and sessions."
        );
      }
    };

    findReports().catch((err) => {
      setError(`Error finding tedana reports: ${err.message}`);
    });
  }, [directory, selectedSubjects, selectedSessions]);

  const handleReportChange = (path: string) => {
    // Remove any leading slash and encode the path
    const normalizedPath = path.replace(/^\//, "");
    setSelectedReport(`tedana://${encodeURI(normalizedPath)}`);
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="card-title flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tedana Report Viewer</h2>
          {reportOptions.length > 0 && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedReport?.replace("tedana://", "")}
              onChange={(e) => {
                console.log("Selected path:", e.target.value); // Debug log
                handleReportChange(e.target.value);
              }}
            >
              {reportOptions.map((option, index) => (
                <option key={index} value={encodeURI(option.path)}>
                  {`${option.subject} - ${option.session}`}
                </option>
              ))}
            </select>
          )}
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