"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AssignmentForm } from "@/components/assignment/AssignmentForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useJobStatus } from "@/hooks/useJobStatus";
import { useAssignmentStore } from "@/store";
import { routes } from "@/constants/routes";
import { joinJobRoom } from "@/lib/socket/client";
import type { JobStatusPayload } from "@/types/websocket";

function ProgressRail() {
  return (
    <div className="mx-auto grid w-full max-w-[930px] grid-cols-2 gap-2 px-3 md:px-0">
      <div className="h-1.5 rounded-full bg-[#6d6d6d]" />
      <div className="h-1.5 rounded-full bg-[#dddddd]" />
    </div>
  );
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const routerRef = useRef(router);
  const hasNavigated = useRef(false);
  
  // Keep router ref in sync with current router
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const assignments = useAssignmentStore((state) => state.assignments);

  // Find only active assignments (processing/generating)
  // Do NOT include completed here — they're handled via WebSocket callback
  const activeAssignment = assignments.find(
    (a) =>
      a.status === "processing" ||
      a.status === "generating"
  );

  const { progress, message, status } = useJobStatus(
    activeAssignment?.id,
    activeAssignment?.jobId
  );

  // Connect WebSocket with fresh router reference
  // Navigation happens ONLY here via onStatus callback
  useWebSocket((payload: JobStatusPayload) => {
    console.log("[Page] WebSocket status update:", payload);
    if (payload.paperId && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("[Page] Navigating to output:", payload.paperId);
      routerRef.current.push(routes.output(payload.paperId));
    }
  });

  // Join job room when jobId becomes available
  useEffect(() => {
    if (!activeAssignment?.jobId) return;
    console.log("[Page] Joining job room:", activeAssignment.jobId);
    joinJobRoom(activeAssignment.jobId);
  }, [activeAssignment?.jobId]);

  const isGenerating = status === "processing" || status === "generating";

  // Safety checks for progress and message
  const progressNumber = typeof progress === "number" ? progress : 0;
  const messageText = typeof message === "string" ? message : "Processing your assignment...";

  return (
    <div className="relative">
      {/* Generation overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl mx-4">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner />
              <h2 className="text-lg font-bold text-[#2d2d2d]">
                Generating Question Paper
              </h2>
              <p className="text-center text-sm text-[#777]">
                {messageText}
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#f0f0f0]">
                <div
                  className="h-2 rounded-full bg-[#242528] transition-all duration-500"
                  style={{ width: `${progressNumber}%` }}
                />
              </div>
              <p className="text-xs text-[#aaa]">{progressNumber}% complete</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1160px] flex-1 flex-col">
        <section className="hidden md:block">
          <div className="mb-10 flex items-start gap-4">
            <span className="mt-2 flex size-5 items-center justify-center rounded-full bg-[#a7e6bb]">
              <span className="size-3 rounded-full bg-[#45c66f]" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#2d2d2d]">
                Create Assignment
              </h1>
              <p className="mt-1 text-base font-medium text-[#a0a0a0]">
                Set up a new assignment for your students
              </p>
            </div>
          </div>
          <ProgressRail />
        </section>

        <section className="md:hidden">
          <div className="mb-8 grid grid-cols-[48px_1fr_48px] items-center">
            <button
              aria-label="Previous"
              type="button"
              className="flex size-12 items-center justify-center rounded-full bg-[#eeeeee] text-[#2d2d2d]"
              onClick={() => router.back()}
            >
              <svg
                aria-hidden="true"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 5 8 12l7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                />
              </svg>
            </button>
            <h1 className="text-center text-base font-bold tracking-[-0.04em] text-[#2d2d2d]">
              Create Assignment
            </h1>
          </div>
          <div className="mb-5">
            <ProgressRail />
          </div>
        </section>

        <div className="mt-8 md:mt-10">
          <AssignmentForm
            renderActions={({ submit, isGenerating: formIsGenerating }) => (
              <div className="mx-auto mt-5 flex w-full max-w-[350px] items-center justify-between gap-3 md:mt-9 md:max-w-[920px]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-medium text-[#2d2d2d] shadow-[0_18px_50px_rgba(0,0,0,0.08)] md:h-13 md:px-8"
                >
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 12H5M12 5l-7 7 7 7"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('[Button] Submit clicked');
                    submit();
                  }}
                  disabled={formIsGenerating || isGenerating}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#171819] px-8 text-base font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition hover:bg-[#050505] disabled:cursor-not-allowed disabled:opacity-60 md:h-13 md:px-9"
                >
                  {formIsGenerating || isGenerating ? <LoadingSpinner /> : null}
                  Next
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
