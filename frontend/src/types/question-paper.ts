export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  text: string;
  type: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[] | null;
  correctAnswer?: number | null;
};

export type QuestionSection = {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
};

export type QuestionPaper = {
  id: string;
  _id: string;
  assignmentId: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  durationMinutes: number;
  totalMarks: number;
  sections: QuestionSection[];
  createdAt: string;
};

export type GeneratedQuestion = Question;
