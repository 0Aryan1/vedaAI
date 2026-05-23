import { z } from "zod";

export const questionConfigSchema = z.object({
  id: z.enum(["mcq", "short", "long", "case-study"]),
  label: z.string().min(1),
  count: z.coerce.number().int().min(0),
  marks: z.coerce.number().int().min(1),
});

export const assignmentSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    subject: z.string().trim().min(2, "Subject is required."),
    className: z.string().trim().min(1, "Class is required."),
    dueDate: z.string().min(1, "Due date is required."),
    uploadedFileName: z.string().optional(),
    sourceText: z.string(),
    questionConfigs: z.array(questionConfigSchema),
    instructions: z.string().max(1200, "Keep instructions under 1200 characters."),
  })
  .refine(
    (data) => data.questionConfigs.some((config) => config.count > 0),
    "Add at least one question."
  )
  .refine(
    (data) => data.sourceText.trim().length > 0 || Boolean(data.uploadedFileName),
    "Upload a file or paste source material."
  );

export type AssignmentValidationResult = ReturnType<typeof assignmentSchema.safeParse>;
