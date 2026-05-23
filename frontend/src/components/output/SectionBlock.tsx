import { QuestionCard } from "@/components/output/QuestionCard";
import type { QuestionSection } from "@/types/question-paper";

type SectionBlockProps = {
  section: QuestionSection;
};

export function SectionBlock({ section }: SectionBlockProps) {
  const sectionMarks = section.questions.reduce((sum, question) => sum + question.marks, 0);

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{section.instruction}</p>
        </div>
        <p className="text-sm font-semibold text-slate-700">{sectionMarks} marks</p>
      </div>
      <ol className="grid gap-3">
        {section.questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </ol>
    </section>
  );
}
