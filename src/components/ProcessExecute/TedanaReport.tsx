import { useEffect, useState } from "react";
import { join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";
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
      <div className="card-body px-8 py-4">
        <div className="card-title flex justify-between items-center pb-2">
          <h2 className="text-2xl font-bold">Tedana Report Viewer</h2>
          <div className="flex gap-2 items-center">
            <Select
              name="report-select"
              value={selectedReport.replace("tedana:/", "")}
              options={reportOptions.map((option) => option.path)}
              onChange={(e) => handleReportChange(e.target.value)}
              size="2xl"
            />
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
