"use client";

import { useEffect } from "react";
import { 
  connectSocket, 
  disconnectSocket, 
  onJobStarted, 
  onJobProgress, 
  onJobCompleted, 
  onJobFailed,
  offAllListeners 
} from "@/lib/socket/client";
import { useAssignmentStore } from "@/store";
import type { JobStatusPayload } from "@/types/websocket";

export function useWebSocket(onStatus?: (payload: JobStatusPayload) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    connectSocket();
    const store = useAssignmentStore.getState();

    // Helper to find assignmentId by jobId
    const getAssignmentIdByJobId = (jobId: string): string | undefined => {
      return store.assignments.find((a) => a.jobId === jobId)?.id;
    };

    // Listen to job:started
    onJobStarted(({ jobId, assignmentId: backendAssignmentId }) => {
      const assignmentId = backendAssignmentId || getAssignmentIdByJobId(jobId);
      if (assignmentId) {
        store.updateStatus(assignmentId, "processing", 0, "Starting generation...");
        onStatus?.({
          jobId,
          assignmentId,
          status: "processing",
          progress: 0,
          message: "Started",
        });
      }
    });

    // Listen to job:progress
    onJobProgress(({ jobId, percentage, message }) => {
      const assignmentId = getAssignmentIdByJobId(jobId);
      if (assignmentId) {
        store.updateStatus(assignmentId, "generating", percentage, message);
        onStatus?.({
          jobId,
          percentage,
          message,
          status: "generating",
        });
      } else {
        // Fallback: update any assignment that's currently processing
        const assignments = store.assignments;
        for (const assignment of assignments) {
          if (assignment.status === "processing" || assignment.status === "generating") {
            store.updateStatus(assignment.id, "generating", percentage, message);
          }
        }
      }
    });

    // Listen to job:completed
    onJobCompleted(({ jobId, assignmentId: backendAssignmentId, paperId }) => {
      const assignmentId = backendAssignmentId || getAssignmentIdByJobId(jobId);
      if (assignmentId) {
        store.updateStatus(assignmentId, "completed", 100, "Question paper ready", paperId);
        onStatus?.({
          jobId,
          assignmentId,
          paperId,
          status: "completed",
          progress: 100,
          message: "Completed",
        });
      }
    });

    // Listen to job:failed
    onJobFailed(({ jobId, error }) => {
      const assignmentId = getAssignmentIdByJobId(jobId);
      if (assignmentId) {
        store.updateStatus(assignmentId, "failed", 0, error);
        onStatus?.({
          jobId,
          error,
          status: "failed",
        });
      } else {
        // Fallback: update any assignment that's currently processing
        const assignments = store.assignments;
        for (const assignment of assignments) {
          if (assignment.status === "processing" || assignment.status === "generating") {
            store.updateStatus(assignment.id, "failed", 0, error);
          }
        }
      }
    });

    return () => {
      offAllListeners();
      disconnectSocket();
    };
  }, [onStatus]);

  return {
    isConnected: true,
    emitLocalStatus: onStatus,
  };
}
