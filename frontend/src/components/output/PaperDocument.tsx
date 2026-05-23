import { PaperHeader } from "@/components/output/PaperHeader";
import { SectionBlock } from "@/components/output/SectionBlock";
import { StudentInfoSection } from "@/components/output/StudentInfoSection";
import type { QuestionPaper } from "@/types/question-paper";

export function PaperDocument({ paper }: { paper: QuestionPaper }) {
  return (
    <article className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm print:border-0 print:shadow-none sm:p-8">
      <PaperHeader paper={paper} />
      <div className="mt-8">
        <StudentInfoSection />
      </div>
      <div className="mt-8 grid gap-8">
        {paper.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}
