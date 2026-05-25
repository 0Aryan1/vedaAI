import { Worker, type Job } from "bullmq";
import OpenAI from "openai";
import { redisConnection } from "../config/bullmq";
import { QUEUE_NAMES, SOCKET_EVENTS } from "../constants";
import { getIO } from "../app";
import { Assignment } from "../models/Assignment.model";
import { QuestionPaper } from "../models/QuestionPaper.model";
import type { PaperGenerationJobData } from "../types/job.types";
import { buildPrompt } from "../utils/promptBuilder";
import { parseAndValidatePaper } from "../utils/responseParser";

const emitProgress = async (
  job: Job<PaperGenerationJobData>,
  percentage: number,
  message: string
) => {
  await job.updateProgress({ percentage, message });
  getIO()
    .to(job.id || "")
    .emit(SOCKET_EVENTS.JOB_PROGRESS, {
      jobId: job.id,
      percentage,
      message,
    });
};

const openai = new OpenAI({
  apiKey: process.env.GLM_API_KEY,
  baseURL: process.env.GLM_BASE_URL || "https://open.bigmodel.cn/api/paas/v4",
});

export const paperWorker = new Worker<PaperGenerationJobData>(
  QUEUE_NAMES.PAPER_GENERATION,
  async (job) => {
    const { assignmentId, assignment } = job.data;

    try {
      await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });

      getIO()
        .to(job.id || "")
        .emit(SOCKET_EVENTS.JOB_STARTED, {
          jobId: job.id,
          assignmentId,
        });

      await emitProgress(job, 10, "Starting generation...");

      const prompt = buildPrompt(assignment);

      await emitProgress(job, 30, "Prompt ready, calling AI...");

      const completion = await openai.chat.completions.create({
        model: process.env.GLM_MODEL || "glm-4-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert teacher and assessment designer. Return only strict JSON matching the requested schema.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 5000,
        response_format: { type: "json_object" },
      });

      const rawContent = completion.choices[0]?.message?.content;
      if (!rawContent) {
        throw new Error("AI returned an empty response");
      }

      await emitProgress(job, 70, "Parsing response...");

      const parsedPaper = parseAndValidatePaper(rawContent);

      await emitProgress(job, 85, "Saving to database...");

      const savedPaper = await QuestionPaper.create({
        ...parsedPaper,
        assignmentId,
        generatedAt: new Date(),
      });

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        paperId: savedPaper._id,
      });

      await emitProgress(job, 100, "Done");

      getIO()
        .to(job.id || "")
        .emit(SOCKET_EVENTS.JOB_COMPLETED, {
          jobId: job.id,
          assignmentId,
          paperId: savedPaper._id.toString(),
        });

      return {
        assignmentId,
        paperId: savedPaper._id.toString(),
      };
    } catch (error) {
      await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });

      const message = error instanceof Error ? error.message : "Paper generation failed";

      getIO()
        .to(job.id || "")
        .emit(SOCKET_EVENTS.JOB_FAILED, {
          jobId: job.id,
          error: message,
        });

      throw error;
    }
  },
  {
    connection: redisConnection,
  }
);

paperWorker.on("failed", (job, error) => {
  console.error(`Paper generation job ${job?.id} failed`, error);
});

paperWorker.on("completed", (job) => {
  console.log(`Paper generation job ${job.id} completed`);
});
