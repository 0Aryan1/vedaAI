import type { QuestionPaper } from "@/types/question-paper";

interface PaperHeaderProps {
  paper: QuestionPaper;
}

export function PaperHeader({ paper }: PaperHeaderProps) {
  return (
    <div className="text-center mb-6">
      {/* School / paper title — large bold */}
      <h1 className="text-2xl font-bold text-gray-900">
        {paper.title}
      </h1>

      {/* Subject */}
      <h2 className="text-lg font-semibold text-gray-800 mt-1">
        Subject: {paper.subject}
      </h2>

      {/* Class */}
      <h3 className="text-lg font-semibold text-gray-800 mt-0.5">
        Class: {paper.className}
      </h3>

      {/* Meta row — time left, marks right */}
      <div className="flex justify-between items-center mt-4 mb-4 text-sm font-bold text-gray-900">
        <span>Time Allowed: {paper.durationMinutes ? `${paper.durationMinutes} minutes` : "3 hours"}</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>

      {/* Instructions */}
      <p className="font-bold text-sm text-gray-900 mb-4">
        All questions are compulsory unless stated otherwise.
      </p>

      {/* Divider */}
      <hr className="border-gray-300 mb-4" />
    </div>
  );
}
