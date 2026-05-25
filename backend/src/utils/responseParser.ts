import { z } from "zod";
import { ApiError } from "./ApiError";

const questionSchema = z
  .object({
    id: z
      .string()
      .default(() => Math.random().toString(36).substring(7)),
    text: z.string().min(1, "Question text is required"),
    type: z.string().default("short"),
    difficulty: z
      .string()
      .transform((d) => {
        const lower = d?.toLowerCase() ?? "";
        if (["easy", "medium", "hard"].includes(lower)) return lower;
        return "medium";
      })
      .default("medium"),
    marks: z
      .number()
      .or(z.string().transform((m) => parseInt(m, 10)))
      .default(1),
    options: z
      .array(z.string())
      .nullable()
      .optional()
      .default(null),
    correctAnswer: z
      .number()
      .nullable()
      .optional()
      .default(null),
  })
  .superRefine((question, ctx) => {
    if (question.type === "mcq" || question.type === "multiple_choice") {
      if (!question.options || question.options.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "MCQ questions must include options",
          path: ["options"],
        });
      }
      if (question.correctAnswer === null || question.correctAnswer === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "MCQ questions must include correctAnswer",
          path: ["correctAnswer"],
        });
      }
    }
  });

const sectionSchema = z.object({
  id: z
    .string()
    .default(() => Math.random().toString(36).substring(7)),
  title: z.string().default("Section"),
  instruction: z.string().default("Attempt all questions."),
  questions: z
    .array(questionSchema)
    .min(1, "Section must have at least 1 question")
    .default([]),
});

export const questionPaperSchema = z.object({
  title: z.string().default("Question Paper"),
  subject: z.string().default("General"),
  gradeLevel: z.string().optional().default(""),
  totalMarks: z
    .number()
    .or(z.string().transform((m) => parseInt(m, 10)))
    .default(0),
  duration: z.string().default("3 hours"),
  sections: z
    .array(sectionSchema)
    .min(1, "Paper must have at least 1 section"),
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
    console.log(
      "[Parser] Failed to parse JSON. Raw response:",
      rawResponse.substring(0, 500)
    );
    throw new ApiError(422, "AI response was not valid JSON", error);
  }

  console.log(
    "[Parser] Parsed JSON structure:",
    JSON.stringify(parsed, null, 2).substring(0, 1000)
  );

  const result = questionPaperSchema.safeParse(parsed);

  if (!result.success) {
    console.log(
      "[Parser] Validation failed:",
      JSON.stringify(result.error.flatten(), null, 2)
    );
    throw new ApiError(
      422,
      "AI response validation failed",
      result.error.flatten()
    );
  }

  return result.data;
};
