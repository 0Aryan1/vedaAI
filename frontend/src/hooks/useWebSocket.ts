"use client";

import { useEffect, useRef } from "react";
import {
  connectSocket,
  onJobStarted,
  onJobProgress,
  onJobCompleted,
  onJobFailed,
} from "@/lib/socket/client";
import { useAssignmentStore } from "@/store";
import type { JobStatusPayload } from "@/types/websocket";

export function useWebSocket(onStatus?: (payload: JobStatusPayload) => void) {
  const onStatusRef = useRef(onStatus);

  // Separate effect to update ref without re-registering listeners
  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("[WS] Hook mounted, connecting socket");
    connectSocket();

    const store = useAssignmentStore.getState();

    const offStarted = onJobStarted(({ jobId, assignmentId: backendAssignmentId }) => {
      console.log("[WS] Job started for assignment:", backendAssignmentId);
      const state = useAssignmentStore.getState();
      const assignment = state.assignments.find((a) => a.jobId === jobId);
      const assignmentId = backendAssignmentId || assignment?.id;

      if (assignmentId) {
        store.updateStatus(assignmentId, "processing", 0, "Starting generation...");
        onStatusRef.current?.({ jobId, assignmentId, message: "Started" });
      }
    });

    const offProgress = onJobProgress(({ jobId, percentage, message }) => {
      console.log(`[WS] Progress ${percentage}%: ${message}`);
      const state = useAssignmentStore.getState();
      const assignment = state.assignments.find((a) => a.jobId === jobId);

      if (assignment) {
        store.updateStatus(assignment.id, "generating", percentage, message);
        onStatusRef.current?.({ jobId, percentage, message });
      }
    });

    const offCompleted = onJobCompleted(({ jobId, assignmentId: backendAssignmentId, paperId }) => {
      console.log("[WS] Job completed! paperId:", paperId);
      const state = useAssignmentStore.getState();
      const assignment = state.assignments.find((a) => a.jobId === jobId);
      const assignmentId = backendAssignmentId || assignment?.id;

      if (assignmentId) {
        store.updateStatus(assignmentId, "completed", 100, "Done!", paperId);
        onStatusRef.current?.({ jobId, assignmentId, paperId });
      }
    });

    const offFailed = onJobFailed(({ jobId, error }) => {
      console.log("[WS] Job failed:", error);
      const state = useAssignmentStore.getState();
      const assignment = state.assignments.find((a) => a.jobId === jobId);

      if (assignment) {
        store.updateStatus(assignment.id, "failed", 0, error);
        onStatusRef.current?.({ jobId, error });
      }
    });

    return () => {
      console.log("[WS] Hook unmounting, removing own listeners only");
      offStarted();
      offProgress();
      offCompleted();
      offFailed();
      // DO NOT call disconnectSocket() — socket persists for session lifetime
    };
  }, []); // empty deps — listeners registered once for lifetime of component

  return {
    isConnected: true,
  };
}
