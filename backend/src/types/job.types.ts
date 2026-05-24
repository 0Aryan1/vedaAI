import type { IAssignment } from "./assignment.types";

export interface PaperGenerationJobData {
  assignmentId: string;
  assignment: IAssignment;
}

export interface JobProgress {
  percentage: number;
  message: string;
}
