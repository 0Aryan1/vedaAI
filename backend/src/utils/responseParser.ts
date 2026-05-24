import { z } from "zod";
import { ApiError } from "./ApiError";

const questionSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    type: z.string().min(1),
    difficulty: z.string().min(1),
    marks: z.number().positive(),
    options: z.array(z.string()).length(4).nullable(),
    correctAnswer: z.number().int().min(0).max(3).nullable(),
  })
  .superRefine((question, ctx) => {
    if (question.type === "mcq") {
      if (!question.options) {
        ctx.addIssue({
          code: "custom",
          message: "MCQ questions must include options",
          path: ["options"],
        });
      }
      if (question.correctAnswer === null) {
        ctx.addIssue({
          code: "custom",
          message: "MCQ questions must include correctAnswer",
          path: ["correctAnswer"],
        });
      }
    } else if (question.options !== null || question.correctAnswer !== null) {
      ctx.addIssue({
        code: "custom",
        message: "Non-MCQ questions must use options and correctAnswer as null",
      });
    }
  });

const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(questionSchema).min(1),
});

export const questionPaperSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  totalMarks: z.number().nonnegative(),
  duration: z.string().min(1),
  sections: z.array(sectionSchema).min(1),
});

export type QuestionPaper = z.infer<typeof questionPaperSchema>;

const stripMarkdownFences = (rawResponse: string): string => {
  return rawResponse
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

export const parseAndValidatePaper = (rawResponse: string): QuestionPaper => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripMarkdownFences(rawResponse));
  } catch (error) {
    throw new ApiError(422, "AI response was not valid JSON", error);
  }

  const result = questionPaperSchema.safeParse(parsed);

  if (!result.success) {
    throw new ApiError(422, "AI response validation failed", result.error.flatten());
  }

  return result.data;
};
