"use client";

import type { QuestionConfig } from "@/types/assignment";

type QuestionTypeSelectorProps = {
  configs: QuestionConfig[];
  onChange: (id: QuestionConfig["id"], patch: Partial<QuestionConfig>) => void;
};

export function QuestionTypeSelector({ configs, onChange }: QuestionTypeSelectorProps) {
  return (
    <div className="grid gap-4">
      {configs.map((config) => (
        <div key={config.id} className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{config.label}</p>
          </div>
          
          {/* Dropdown for question type */}
          <div className="flex items-center gap-2">
            <select
              value={config.count > 0 ? "included" : "excluded"}
              onChange={(e) =>
                onChange(config.id, { count: e.target.value === "included" ? 1 : 0 })
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
            >
              <option value="excluded">Excluded</option>
              <option value="included">Included</option>
            </select>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onChange(config.id, { count: 0 })}
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6l1.4 1.4L12 13.4l5.6 5.6 1.4-1.4-5.6-5.6 5.6-5.6z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
