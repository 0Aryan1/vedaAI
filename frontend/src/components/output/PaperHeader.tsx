import { formatDate } from "@/lib/utils/format";
import type { QuestionPaper } from "@/types/question-paper";

export function PaperHeader({ paper }: { paper: QuestionPaper }) {
  return (
    <header className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        AI Generated Assessment
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{paper.title}</h1>
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
        <span>Subject: {paper.subject}</span>
        <span>Class: {paper.className}</span>
        <span>Due: {formatDate(paper.dueDate)}</span>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-semibold text-slate-800">
        <span className="rounded-full bg-slate-100 px-3 py-1">Total Marks: {paper.totalMarks}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          Duration: {paper.durationMinutes} min
        </span>
      </div>
    </header>
  );
}
