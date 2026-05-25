import { QuestionCard } from "./QuestionCard";
import type { QuestionSection } from "@/types/question-paper";

interface SectionBlockProps {
  section: QuestionSection;
  startNumber: number;
}

function getQuestionTypeLabel(type?: string): string {
  if (!type) return "Questions";
  const labels: Record<string, string> = {
    mcq: "Multiple Choice Questions",
    short: "Short Answer Questions",
    long: "Long Answer Questions",
    "true-false": "True or False Questions",
    "case-study": "Case Study Questions",
  };
  return labels[type] || "Questions";
}

export function SectionBlock({ section, startNumber }: SectionBlockProps) {
  return (
    <div className="mb-8">
      {/* Section title — centered, not bold, larger */}
      <h2 className="text-center text-xl font-semibold text-gray-900 mb-3">
        {section.title}
      </h2>

      {/* Question type label — bold */}
      <p className="font-bold text-sm text-gray-900 mb-1">
        {getQuestionTypeLabel(section.questions[0]?.type)}
      </p>

      {/* Instruction — italic */}
      <p className="italic text-sm text-gray-600 mb-4">
        {section.instruction}
      </p>

      {/* Questions as ordered list */}
      <ol
        className="list-decimal list-outside ml-6 space-y-3"
        start={startNumber}
      >
        {section.questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </ol>
    </div>
  );
}
