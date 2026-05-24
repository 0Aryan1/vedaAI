export type QuestionType = "mcq" | "short" | "long" | "case-study";

export type GenerationStatus = "draft" | "processing" | "generating" | "completed" | "failed";

export type QuestionConfig = {
  id: QuestionType | string;
  label: string;
  count: number;
  marks: number;
};

export type AssignmentFormValues = {
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  instructions: string;
  questionConfigs: QuestionConfig[];
};

export type Assignment = {
  id: string;
  _id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  instructions: string;
  questionConfigs: QuestionConfig[];
  totalMarks: number;
  createdAt: string;
  status: GenerationStatus;
  jobId?: string;
  paperId?: string;
};
