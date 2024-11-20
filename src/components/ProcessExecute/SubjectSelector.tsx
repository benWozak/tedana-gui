import { useState, Fragment } from "react";

type Props = {
  subjects: { id: number; name: string; sessions: string[] }[];
  selectedSubjectIds: number[];
  selectedSessionIds: { [subjectId: number]: string[] };
  handleSubjectSelection: (subjectId: number) => void;
  handleSessionSelection: (subjectId: number, sessionName: string) => void;
};

const SubjectSelector = ({
  subjects,
  selectedSubjectIds,
  selectedSessionIds,
  handleSubjectSelection,
  handleSessionSelection,
}: Props) => {
  const [expandedSubjects, setExpandedSubjects] = useState<number[]>([]);

  const toggleAccordion = (subjectId: number) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  if (!subjects || subjects.length === 0) {
    return <div>No subjects available</div>;
  }

  return (
    <div className="join join-vertical w-full">
      {subjects.map((subject, index) => {
        if (!subject) return null;

        const isExpanded = expandedSubjects.includes(subject.id);
        const subjectSessions = selectedSessionIds[subject.id] || [];

        return (
          <div
            key={index}
            className="collapse collapse-arrow join-item border-base-300 border mb-4"
          >
            <input
              type="checkbox"
              className="peer"
              checked={isExpanded}
              onChange={() => toggleAccordion(subject.id)}
            />
            <div className="collapse-title text-xl font-medium flex items-center py-0 px-4">
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedSubjectIds.includes(subject.id)}
                    onChange={() => handleSubjectSelection(subject.id)}
                  />
                  <span className="label-text">{subject.name}</span>
                </label>
              </div>
              {/* This empty div takes up the remaining space for the collapse arrow */}
              <div className="flex-grow"></div>
            </div>
            <div className="collapse-content">
              <div className="ml-6 mt-2">
                {subject.sessions?.map((session, index) => (
                  <Fragment key={index}>
                    <div className="form-control flex-row">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          checked={subjectSessions.includes(session)}
                          onChange={() =>
                            handleSessionSelection(subject.id, session)
                          }
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <span className="label-text">{session}</span>
                      </label>
                    </div>
                    <hr className=" my-0" />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubjectSelector;
