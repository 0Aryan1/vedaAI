export type Difficulty = "easy" | "medium" | "hard";

export type GeneratedQuestion = {
  id: string;
  text: string;
  type: string;
  difficulty: Difficulty;
  marks: number;
};

export type QuestionSection = {
  id: string;
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
};

export type QuestionPaper = {
  id: string;
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
