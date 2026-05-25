import type { Question } from "@/types/question-paper";

interface QuestionCardProps {
  question: Question;
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: "Easy",
    medium: "Moderate",
    hard: "Challenging",
  };
  return labels[difficulty] || "Moderate";
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <li className="text-sm text-gray-900 leading-relaxed break-inside-avoid">
      <span className="font-normal">
        [{getDifficultyLabel(question.difficulty)}]{' '}
        {question.text}{' '}
        <span className="font-normal">
          [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
        </span>
      </span>

      {/* MCQ options if present */}
      {question.options && question.options.length > 0 && (
        <ol className="list-[lower-alpha] list-outside ml-6 mt-1 space-y-0.5">
          {question.options.map((option, i) => (
            <li key={i} className="text-sm text-gray-800">
              {option}
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}
