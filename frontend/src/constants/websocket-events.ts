export const SOCKET_EVENTS = {
  JOB_STARTED: 'job:started',
  JOB_PROGRESS: 'job:progress',
  JOB_COMPLETED: 'job:completed',
  JOB_FAILED: 'job:failed',
} as const;

export const websocketEvents = SOCKET_EVENTS;
