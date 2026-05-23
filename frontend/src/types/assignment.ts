export type QuestionType = "mcq" | "short" | "long" | "case-study";

export type GenerationStatus = "idle" | "queued" | "generating" | "completed" | "failed";

export type QuestionConfig = {
  id: QuestionType;
  label: string;
  count: number;
  marks: number;
};

export type AssignmentFormValues = {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  uploadedFileName?: string;
  sourceText: string;
  questionConfigs: QuestionConfig[];
  instructions: string;
};

export type Assignment = AssignmentFormValues & {
  id: string;
  createdAt: string;
  status: GenerationStatus;
  paperId?: string;
};
