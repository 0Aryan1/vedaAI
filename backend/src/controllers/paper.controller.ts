import type { Request, Response } from "express";
import { JOB_STATUS } from "../constants";
import { QuestionPaper } from "../models/QuestionPaper.model";
import { paperQueue } from "../queues/paper.queue";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getPaper = asyncHandler(async (req: Request, res: Response) => {
  const paper = await QuestionPaper.findById(req.params.id);

  if (!paper) {
    throw new ApiError(404, "Question paper not found");
  }

  return res.status(200).json(new ApiResponse(200, "Question paper fetched", paper));
});

export const getPaperByAssignment = asyncHandler(async (req: Request, res: Response) => {
  const paper = await QuestionPaper.findOne({ assignmentId: req.params.assignmentId });

  if (!paper) {
    throw new ApiError(404, "Question paper not found");
  }

  return res.status(200).json(new ApiResponse(200, "Question paper fetched", paper));
});

export const getJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const job = await paperQueue.getJob(String(req.params.jobId));

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const state = await job.getState();
  const status =
    state === "completed"
      ? JOB_STATUS.COMPLETED
      : state === "failed"
        ? JOB_STATUS.FAILED
        : state === "active"
          ? JOB_STATUS.ACTIVE
          : JOB_STATUS.WAITING;

  return res.status(200).json(
    new ApiResponse(200, "Job status fetched", {
      status,
      progress: job.progress,
      failedReason: job.failedReason,
    })
  );
});
