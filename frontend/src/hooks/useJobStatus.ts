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

    // Guard against Strict Mode double-mount
    if (hasStarted.current) return;
    hasStarted.current = true;

    const currentStatus = useAssignmentStore
      .getState()
      .assignments.find((a) => a.id === assignmentId)?.status;

    if (currentStatus === "completed" || currentStatus === "failed") {
      hasStarted.current = false;
      return;
    }

    console.log("[Poll] Starting poll for jobId:", jobId);

    const interval = setInterval(async () => {
      try {
        console.log("[Poll] Polling job status:", jobId);
        const result = await paperApi.getJobStatus(jobId);
        console.log("[Poll] Full result:", JSON.stringify(result));

        // Update progress during polling to keep UI current
        if (result.status === "active") {
          console.log("[Poll] Updating progress:", { percentage: result.percentage, message: result.message });
          useAssignmentStore.getState().updateStatus(
            assignmentId,
            "generating",
            result.percentage,
            result.message
          );
        }

        if (result.status === "completed") {
          console.log("[Poll] Job completed, stopping poll");
          clearInterval(interval);
          hasStarted.current = false;

          const paperId = result.paperId;
          console.log("[Poll] paperId:", paperId);

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
          console.log("[Poll] Job failed, stopping poll");
          clearInterval(interval);
          hasStarted.current = false;
          useAssignmentStore.getState().updateStatus(
            assignmentId,
            "failed",
            0,
            result.failedReason || "Generation failed"
          );
        }
      } catch (err) {
        console.error("[Poll] Error:", err);
      }
    }, 3000);

    return () => {
      console.log("[Poll] Cleaning up interval");
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
