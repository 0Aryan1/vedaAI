import { Assignment } from "../models/Assignment.model";
import { addPaperGenerationJob } from "../queues/paper.queue";
import { ApiError } from "../utils/ApiError";

export const createGeneratePaperJob = async (assignmentId: string) => {
  const assignment = await Assignment.findById(assignmentId).lean();

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  const jobId = `paper-${assignmentId}-${Date.now()}`;

  await addPaperGenerationJob(
    {
      assignmentId,
      assignment,
    },
    jobId
  );

  await Assignment.findByIdAndUpdate(assignmentId, { jobId });

  return { jobId };
};
