import type { Request, Response } from "express";
import { z } from "zod";
import { DIFFICULTY, QUESTION_TYPES } from "../constants";
import { createGeneratePaperJob } from "../jobs/generatePaper.job";
import { Assignment } from "../models/Assignment.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const sectionSchema = z.object({
  name: z.string().trim().min(1),
  questionType: z.enum(Object.values(QUESTION_TYPES) as [string, ...string[]]),
  numberOfQuestions: z.coerce.number().int().min(1),
  marksPerQuestion: z.coerce.number().int().min(1),
  difficulty: z.enum(Object.values(DIFFICULTY) as [string, ...string[]]),
});

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  gradeLevel: z.string().trim().min(1),
  dueDate: z.string().min(1, "Due date is required"),
  sections: z.array(sectionSchema).min(1),
  additionalInstructions: z.string().trim().optional(),
  extractedText: z.string().optional(),
});

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await Assignment.create(req.body);
  const { jobId } = await createGeneratePaperJob(assignment._id.toString());

  const updatedAssignment = await Assignment.findById(assignment._id);

  console.log('Assignment created:', assignment._id);

  return res.status(201).json(
    new ApiResponse(201, "Assignment created", {
      assignment: updatedAssignment,
      jobId,
    })
  );
});

export const getAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id).populate("paperId");

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  return res.status(200).json(new ApiResponse(200, "Assignment fetched", assignment));
});

export const getAllAssignments = asyncHandler(async (_req: Request, res: Response) => {
  const assignments = await Assignment.find().sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, "Assignments fetched", assignments));
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  return res.status(200).json(new ApiResponse(200, "Assignment deleted", assignment));
});
