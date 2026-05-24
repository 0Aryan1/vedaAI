"use client";

import { useRouter } from "next/navigation";
import { AssignmentForm } from "@/components/assignment/AssignmentForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

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

  return (
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
            <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
              <path d="M15 5 8 12l7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
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
          renderActions={({ submit, isGenerating }) => (
            <div className="mx-auto mt-5 flex w-full max-w-[350px] items-center justify-between gap-3 md:mt-9 md:max-w-[920px]">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-medium text-[#2d2d2d] shadow-[0_18px_50px_rgba(0,0,0,0.08)] md:h-13 md:px-8"
              >
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Previous
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={isGenerating}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#171819] px-8 text-base font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition hover:bg-[#050505] disabled:cursor-not-allowed disabled:opacity-60 md:h-13 md:px-9"
              >
                {isGenerating ? <LoadingSpinner /> : null}
                Next
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
