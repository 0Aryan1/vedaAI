import type { GenerationStatus } from "./assignment";

export type JobStatusPayload = {
  assignmentId: string;
  status: GenerationStatus;
  progress: number;
  message: string;
  paperId?: string;
};
