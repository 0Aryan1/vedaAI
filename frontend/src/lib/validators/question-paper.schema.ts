import { z } from "zod";

export const questionPaperSchema = z.object({
  id: z.string().min(1),
  assignmentId: z.string().min(1),
  title: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  dueDate: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  totalMarks: z.number().int().nonnegative(),
  createdAt: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      instruction: z.string().min(1),
      questions: z.array(
        z.object({
          id: z.string().min(1),
          text: z.string().min(1),
          type: z.string().min(1),
          difficulty: z.enum(["easy", "medium", "hard"]),
          marks: z.number().int().positive(),
        })
      ),
    })
  ),
});
