"use client";

import Link from "next/link";
import Image from "next/image";
import { routes } from "@/constants/routes";
import { formatDate } from "@/lib/utils/format";
import { useAssignmentStore } from "@/store";

function EmptyAssignmentsIllustration() {
  return (
    <div className="relative mx-auto h-58 w-64 sm:h-72 sm:w-78 md:h-80 md:w-88">
      <Image
        src="/icons/Illustration found.svg"
        alt="No assignments illustration"
        fill
        className="object-contain"
      />
    </div>
  );
}

function EmptyAssignments() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <EmptyAssignmentsIllustration />
        <h1 className="mt-5 text-2xl font-bold text-[#2e3033] sm:text-3xl">
          No assignments yet
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[#888] sm:text-base">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link
          href={routes.createAssignment}
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-7 text-sm font-semibold text-white transition hover:bg-[#333] sm:h-12 sm:px-8 sm:text-base"
        >
          <svg aria-hidden="true" className="size-5 sm:size-6" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
          </svg>
          Create Your First Assignment
        </Link>
      </div>
    </section>
  );
}

function AssignmentsList() {
  const assignments = useAssignmentStore((state) => state.assignments);

  return (
    <section className="mx-auto w-full max-w-5xl pt-6 md:pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#999]">Assignments</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tighter text-[#2e3033]">
            Your assignments
          </h1>
        </div>
        <Link
          href={routes.createAssignment}
          className="flex h-12 items-center justify-center rounded-full bg-[#171819] px-6 text-base font-bold text-white"
        >
          Create Assignment
        </Link>
      </div>
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Link
            key={assignment.id}
            href={assignment.paperId ? routes.output(assignment.paperId) : routes.assignment(assignment.id)}
            className="group grid gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md sm:grid-cols-[1fr_auto] sm:gap-4 sm:p-5 md:gap-6 md:rounded-2xl"
          >
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-[#2e3033] sm:text-xl">
                    {assignment.title}
                  </h2>
                  <span className="rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-semibold uppercase text-[#666]">
                    {assignment.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#999] sm:text-base">
                  {assignment.subject} • {assignment.className} • Due {formatDate(assignment.dueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#ff8a1f] transition group-hover:translate-x-1">
              <span className="text-sm font-semibold sm:text-base">
                {assignment.paperId ? "View paper" : "View status"}
              </span>
              <svg aria-hidden="true" className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function AssignmentsPage() {
  const assignments = useAssignmentStore((state) => state.assignments);

  return assignments.length === 0 ? <EmptyAssignments /> : <AssignmentsList />;
}
