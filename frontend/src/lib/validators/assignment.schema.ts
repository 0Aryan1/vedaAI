import { z } from "zod";

export const questionConfigSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  count: z.coerce.number().int().min(0),
  marks: z.coerce.number().int().min(1),
});

export const assignmentSchema = z
  .object({
    title: z.string().trim().optional(),
    subject: z.string().trim().optional(),
    gradeLevel: z.string().trim().optional(),
    dueDate: z.string().min(1, "Due date is required."),
    questionConfigs: z.array(questionConfigSchema),
    instructions: z.string().min(10, "Please describe your assessment requirements (minimum 10 characters)").max(1200, "Maximum 1200 characters allowed"),
  })
  .refine(
    (data) => data.questionConfigs.some((config) => config.count > 0),
    "Add at least one question."
  );

export type AssignmentValidationResult = ReturnType<typeof assignmentSchema.safeParse>;
