import type { QuestionPaper, Question } from "@/types/question-paper";

interface AnswerKeySectionProps {
  paper: QuestionPaper;
}

function getAnswer(question: Question & { answer?: string }): string {
  // MCQ with correct answer
  if (
    question.type === "mcq" &&
    question.correctAnswer !== null &&
    question.correctAnswer !== undefined &&
    question.options &&
    question.options.length > 0
  ) {
    return question.options[question.correctAnswer];
  }

  // True/False
  if (question.type === "true-false") {
    return question.correctAnswer === 0 ? "True" : "False";
  }

  // If answer text exists (from backend)
  if (question.answer) {
    return question.answer;
  }

  // Placeholder for short/long answer questions
  return "[Refer to textbook]";
}

export function AnswerKeySection({ paper }: AnswerKeySectionProps) {
  // Collect all questions with answers
  const answersWithQuestions = paper.sections.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      answer: getAnswer(q),
    }))
  );

  return (
    <div className="mt-8 pt-6">
      <h2 className="font-bold text-lg text-gray-900 mb-4">Answer Key:</h2>

      <ol className="list-decimal list-outside ml-6 space-y-3 text-sm text-gray-900">
        {answersWithQuestions.map((question) => (
          <li key={question.id} className="leading-relaxed break-inside-avoid">
            {question.answer}
          </li>
        ))}
      </ol>
    </div>
  );
}
