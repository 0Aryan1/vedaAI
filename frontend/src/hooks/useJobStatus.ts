"use client";

import { useAssignmentStore } from "@/store";

export function useJobStatus(assignmentId?: string) {
  const progress = useAssignmentStore((state) =>
    assignmentId ? (state.progressByAssignment[assignmentId] ?? 0) : 0
  );
  const message = useAssignmentStore((state) =>
    assignmentId ? (state.messageByAssignment[assignmentId] ?? "No active job") : "No active job"
  );
  const assignment = useAssignmentStore((state) =>
    assignmentId ? state.assignments.find((item) => item.id === assignmentId) : undefined
  );

  return {
    progress,
    message,
    status: assignment?.status ?? "idle",
  };
}
