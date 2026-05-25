import type { QuestionPaper } from "@/types/question-paper";

interface GeneralInstructionsProps {
  paper: QuestionPaper;
}

export function GeneralInstructions({ paper }: GeneralInstructionsProps) {
  return (
    <div className="mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
        General Instructions
      </h3>
      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
        <li>All questions are compulsory unless stated otherwise.</li>
        <li>Read each question carefully before answering.</li>
        <li>Write neat and legible answers.</li>
        <li>
          This paper contains {paper.sections.length} sections and {paper.totalMarks} total marks.
        </li>
      </ol>
    </div>
  );
}
