import type { QuestionConfig } from "@/types/assignment";

export const QUESTION_TYPE_OPTIONS: QuestionConfig[] = [
  { id: "mcq", label: "Multiple Choice (MCQ)", count: 0, marks: 1 },
  { id: "short", label: "Short Answer", count: 0, marks: 3 },
  { id: "long", label: "Long Answer", count: 0, marks: 5 },
  { id: "true-false", label: "True / False", count: 0, marks: 1 },
  { id: "case-study", label: "Case Study", count: 0, marks: 10 },
];

export const DEFAULT_QUESTION_CONFIGS = QUESTION_TYPE_OPTIONS;
