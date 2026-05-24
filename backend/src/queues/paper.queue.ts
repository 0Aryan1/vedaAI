import { Queue } from "bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { defaultJobOptions, redisConnection } from "../config/bullmq";
import type { PaperGenerationJobData } from "../types/job.types";

export const paperQueue = new Queue<PaperGenerationJobData>(QUEUE_NAMES.PAPER_GENERATION, {
  connection: redisConnection,
  defaultJobOptions,
});

export const addPaperGenerationJob = async (
  data: PaperGenerationJobData,
  jobId: string
) => {
  return paperQueue.add(JOB_NAMES.GENERATE_PAPER, data, { jobId });
};
