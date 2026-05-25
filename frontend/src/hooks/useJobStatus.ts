"use client";

import { useEffect, useRef } from "react";
import { useAssignmentStore } from "@/store";
import { paperApi } from "@/lib/api/papers";

export function useJobStatus(assignmentId?: string, jobId?: string) {
  const hasStarted = useRef(false);

  const progress = useAssignmentStore((state) =>
    assignmentId ? (state.progressByAssignment[assignmentId] ?? 0) : 0
  );
  const message = useAssignmentStore((state) =>
    assignmentId ? (state.messageByAssignment[assignmentId] ?? "") : ""
  );
  const assignment = useAssignmentStore((state) =>
    assignmentId ? state.assignments.find((item) => item.id === assignmentId) : undefined
  );

  // Polling fallback for job status
  useEffect(() => {
    if (!jobId || !assignmentId) return;

    if (hasStarted.current) return;
    hasStarted.current = true;

    const currentStatus = useAssignmentStore
      .getState()
      .assignments.find((a) => a.id === assignmentId)?.status;

    if (currentStatus === "completed" || currentStatus === "failed") {
      hasStarted.current = false;
      return;
    }

    const interval = setInterval(async () => {
      try {
        const result = await paperApi.getJobStatus(jobId);

        if (result.status === "active") {
          useAssignmentStore.getState().updateStatus(
            assignmentId,
            "generating",
            result.percentage,
            result.message
          );
        }

        if (result.status === "completed") {
          clearInterval(interval);
          hasStarted.current = false;

          const paperId = result.paperId;

          if (paperId && assignmentId) {
            useAssignmentStore.getState().updateStatus(
              assignmentId,
              "completed",
              100,
              "Done!",
              paperId
            );
          }
        }

        if (result.status === "failed") {
          clearInterval(interval);
          hasStarted.current = false;
          useAssignmentStore.getState().updateStatus(
            assignmentId,
            "failed",
            0,
            result.failedReason || "Generation failed"
          );
        }
      } catch {
        // Polling error - will retry on next interval
      }
    }, 3000);

    return () => {
      hasStarted.current = false;
      clearInterval(interval);
    };
  }, [jobId, assignmentId]);

  return {
    progress,
    message,
    status: assignment?.status ?? "idle",
  };
}
