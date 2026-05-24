"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/store";
import { paperApi } from "@/lib/api/papers";

export function useJobStatus(assignmentId?: string, jobId?: string) {
  const updateStatus = useAssignmentStore((state) => state.updateStatus);
  const progress = useAssignmentStore((state) =>
    assignmentId ? (state.progressByAssignment[assignmentId] ?? 0) : 0
  );
  const message = useAssignmentStore((state) =>
    assignmentId ? (state.messageByAssignment[assignmentId] ?? "No active job") : "No active job"
  );
  const assignment = useAssignmentStore((state) =>
    assignmentId ? state.assignments.find((item) => item.id === assignmentId) : undefined
  );

  // Polling fallback for job status
  useEffect(() => {
    if (!jobId || !assignmentId) return;

    const status = assignment?.status;
    if (status !== "processing" && status !== "generating") return;

    const interval = setInterval(async () => {
      try {
        const result = await paperApi.getJobStatus(jobId);
        if (result.status === "completed") {
          updateStatus(assignmentId, "completed", 100, "Question paper ready");
          clearInterval(interval);
        } else if (result.status === "failed") {
          updateStatus(assignmentId, "failed", 0, result.failedReason || "Generation failed");
          clearInterval(interval);
        } else {
          updateStatus(assignmentId, "generating", result.progress ?? 0, "Generating...");
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [jobId, assignmentId, assignment?.status, updateStatus]);

  return {
    progress,
    message,
    status: assignment?.status ?? "idle",
  };
}
