"use client";

import type { QuestionPaper } from "@/types/question-paper";

interface ActionBarProps {
  paper: QuestionPaper;
}

export function ActionBar({ paper }: ActionBarProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#1e1e1e] px-6 py-4 text-white">
      <div>
        <p className="text-sm font-semibold">
          Question paper generated successfully
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {paper.subject} · Class {paper.className} · {paper.totalMarks} marks ·{' '}
          {paper.durationMinutes ? `${paper.durationMinutes} minutes` : "3 hours"}
        </p>
      </div>

      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 3v12M7 11l5 5 5-5M5 19h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download as PDF
      </button>
    </div>
  );
}
