import { DifficultyBadge } from "@/components/output/DifficultyBadge";
import type { GeneratedQuestion } from "@/types/question-paper";

type QuestionCardProps = {
  question: GeneratedQuestion;
  index: number;
};

export function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <li className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto]">
      <div className="flex gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          {index + 1}
        </span>
        <p className="text-sm leading-6 text-slate-900">{question.text}</p>
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {question.marks} marks
        </span>
      </div>
    </li>
  );
}
