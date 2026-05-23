import type { QuestionConfig } from "@/types/assignment";

export const QUESTION_TYPE_OPTIONS: QuestionConfig[] = [
  { id: "mcq", label: "Multiple Choice", count: 5, marks: 1 },
  { id: "short", label: "Short Answer", count: 4, marks: 3 },
  { id: "long", label: "Long Answer", count: 2, marks: 5 },
  { id: "case-study", label: "Case Study", count: 1, marks: 8 },
];
