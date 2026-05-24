export const DB_NAME = "your_db_name";
export const QUEUE_NAMES = {
  PAPER_GENERATION: "paper-generation",
} as const;

export const JOB_NAMES = {
  GENERATE_PAPER: "generate-paper",
} as const;

export const SOCKET_EVENTS = {
  JOB_STARTED: "job:started",
  JOB_PROGRESS: "job:progress",
  JOB_COMPLETED: "job:completed",
  JOB_FAILED: "job:failed",
} as const;

export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export const QUESTION_TYPES = {
  MCQ: "mcq",
  SHORT: "short",
  LONG: "long",
  TRUE_FALSE: "true-false",
  CASE_STUDY: "case-study",
} as const;

export const JOB_STATUS = {
  WAITING: "waiting",
  ACTIVE: "active",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;
