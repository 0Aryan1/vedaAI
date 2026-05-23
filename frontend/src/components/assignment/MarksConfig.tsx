"use client";

import type { QuestionConfig } from "@/types/assignment";

type MarksConfigProps = {
  configs: QuestionConfig[];
  onChange: (id: QuestionConfig["id"], patch: Partial<QuestionConfig>) => void;
};

export function MarksConfig({ configs, onChange }: MarksConfigProps) {
  return (
    <div className="grid gap-4">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_80px_80px] gap-4 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
        <div>Question Type</div>
        <div className="text-center">No. of Questions</div>
        <div className="text-center">Marks</div>
        <div className="text-center">Total</div>
      </div>

      {/* Table Body */}
      {configs.map((config) => (
        <div
          key={config.id}
          className="grid grid-cols-[1fr_100px_80px_80px] gap-4 items-center rounded-lg bg-slate-50 px-4 py-4"
        >
          <div className="text-sm font-medium text-slate-900">{config.label}</div>
          
          {/* Count Input */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                onChange(config.id, { count: Math.max(0, config.count - 1) })
              }
              className="flex size-8 items-center justify-center rounded-l-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              −
            </button>
            <input
              type="number"
              value={config.count}
              onChange={(event) =>
                onChange(config.id, { count: Math.max(0, Number(event.target.value)) })
              }
              className="w-12 border-y border-slate-300 bg-white text-center text-sm font-medium text-slate-900"
            />
            <button
              type="button"
              onClick={() =>
                onChange(config.id, { count: config.count + 1 })
              }
              className="flex size-8 items-center justify-center rounded-r-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              +
            </button>
          </div>

          {/* Marks Input */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                onChange(config.id, { marks: Math.max(1, config.marks - 1) })
              }
              className="flex size-8 items-center justify-center rounded-l-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              −
            </button>
            <input
              type="number"
              value={config.marks}
              onChange={(event) =>
                onChange(config.id, { marks: Math.max(1, Number(event.target.value)) })
              }
              className="w-12 border-y border-slate-300 bg-white text-center text-sm font-medium text-slate-900"
            />
            <button
              type="button"
              onClick={() =>
                onChange(config.id, { marks: config.marks + 1 })
              }
              className="flex size-8 items-center justify-center rounded-r-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              +
            </button>
          </div>

          {/* Total */}
          <div className="text-center text-sm font-medium text-slate-900">
            {config.count * config.marks}
          </div>
        </div>
      ))}
    </div>
  );
}
