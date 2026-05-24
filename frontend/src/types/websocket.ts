import type { GenerationStatus } from "./assignment";

export type JobStatusPayload = {
  jobId?: string;
  assignmentId?: string;
  status?: GenerationStatus;
  progress?: number;
  message?: string;
  paperId?: string;
  percentage?: number;
  error?: string;
};

export type SocketEvents = {
  'job:started': { jobId: string; assignmentId: string }
  'job:progress': { jobId: string; percentage: number; message: string }
  'job:completed': { jobId: string; assignmentId: string; paperId: string }
  'job:failed': { jobId: string; error: string }
}
