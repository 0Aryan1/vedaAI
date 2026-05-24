"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAssignmentForm } from "@/hooks/useAssignmentForm";
import type { ReactNode } from "react";
import type { QuestionConfig } from "@/types/assignment";

function Stepper({
  value,
  min,
  onChange,
}: {
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid h-11 grid-cols-[32px_1fr_32px] items-center rounded-full bg-white px-2 text-[#2d2d2d]">
      <button
        type="button"
        className="flex size-7 items-center justify-center rounded-full text-xl leading-none text-[#d2d2d2] transition hover:bg-[#f4f4f4] hover:text-[#777]"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        -
      </button>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value)))}
        className="h-full min-w-0 bg-transparent text-center text-base font-semibold outline-none"
      />
      <button
        type="button"
        className="flex size-7 items-center justify-center rounded-full text-xl leading-none text-[#d2d2d2] transition hover:bg-[#f4f4f4] hover:text-[#777]"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

function QuestionRow({
  config,
  onChange,
}: {
  config: QuestionConfig;
  onChange: (id: QuestionConfig["id"], patch: Partial<QuestionConfig>) => void;
}) {
  return (
    <>
      <div className="grid gap-3 rounded-[18px] bg-white p-3 md:hidden">
        <div className="flex h-8 items-center justify-between gap-3 px-1">
          <button type="button" className="flex min-w-0 flex-1 items-center justify-between text-left text-sm font-medium text-[#2d2d2d]">
            <span className="truncate">{config.label}</span>
            <svg aria-hidden="true" className="ml-2 size-4 shrink-0" fill="none" viewBox="0 0 24 24">
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`Remove ${config.label}`}
            className="flex size-7 items-center justify-center rounded-full text-xl font-light text-[#2d2d2d]"
            onClick={() => onChange(config.id, { count: 0 })}
          >
            x
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-[18px] bg-[#f0f0f0] p-2">
          <div className="grid gap-2">
            <span className="text-center text-sm font-medium text-[#2d2d2d]">No. of Questions</span>
            <Stepper value={config.count} min={0} onChange={(count) => onChange(config.id, { count })} />
          </div>
          <div className="grid gap-2">
            <span className="text-center text-sm font-medium text-[#2d2d2d]">Marks</span>
            <Stepper value={config.marks} min={1} onChange={(marks) => onChange(config.id, { marks })} />
          </div>
        </div>
      </div>

      <div className="hidden grid-cols-[minmax(0,1fr)_34px_114px_114px] items-center gap-4 md:grid">
        <button
          type="button"
          className="flex h-11 items-center justify-between rounded-full bg-white px-5 text-left text-base font-medium text-[#2d2d2d]"
        >
          <span className="truncate">{config.label}</span>
          <svg aria-hidden="true" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={`Remove ${config.label}`}
          className="flex size-8 items-center justify-center rounded-full text-2xl font-light text-[#2d2d2d] transition hover:bg-white"
          onClick={() => onChange(config.id, { count: 0 })}
        >
          x
        </button>
        <Stepper value={config.count} min={0} onChange={(count) => onChange(config.id, { count })} />
        <Stepper value={config.marks} min={1} onChange={(marks) => onChange(config.id, { marks })} />
      </div>
    </>
  );
}

type AssignmentFormProps = {
  renderActions?: (actions: { submit: () => void; isGenerating: boolean }) => ReactNode;
};

export function AssignmentForm({ renderActions }: AssignmentFormProps) {
  const {
    values,
    errors,
    isGenerating,
    totalQuestions,
    totalMarks,
    updateDraft,
    setQuestionConfig,
    submit,
  } = useAssignmentForm();

  return (
    <div className="mx-auto w-full max-w-[350px] md:max-w-[920px]">
      <div className="rounded-[30px] bg-[#eeeeee] px-4 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:px-9 md:py-10">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.04em] text-[#2d2d2d]">Assignment Details</h1>
          <p className="mt-1 text-sm font-medium text-[#777]">Basic information about your assignment</p>
        </div>

        <div className="mt-7 grid gap-5 md:mt-9">
          <div className="grid gap-3">
            <label className="text-base font-bold tracking-[-0.04em] text-[#2d2d2d]" htmlFor="assignment-title">
              Title
            </label>
            <input
              id="assignment-title"
              type="text"
              placeholder="e.g Final Exam - Chemistry"
              value={values.title}
              onChange={(event) => updateDraft({ title: event.target.value })}
              className="h-11 w-full rounded-full border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#2d2d2d] outline-none placeholder:text-[#b3b3b3] focus:border-[#b8b8b8]"
            />
            {errors.title ? <p className="text-xs text-red-600">{errors.title}</p> : null}
          </div>

          <div className="grid gap-3">
            <label className="text-base font-bold tracking-[-0.04em] text-[#2d2d2d]" htmlFor="assignment-subject">
              Subject
            </label>
            <input
              id="assignment-subject"
              type="text"
              placeholder="e.g Chemistry, Biology, etc."
              value={values.subject}
              onChange={(event) => updateDraft({ subject: event.target.value })}
              className="h-11 w-full rounded-full border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#2d2d2d] outline-none placeholder:text-[#b3b3b3] focus:border-[#b8b8b8]"
            />
            {errors.subject ? <p className="text-xs text-red-600">{errors.subject}</p> : null}
          </div>

          <div className="grid gap-3">
            <label className="text-base font-bold tracking-[-0.04em] text-[#2d2d2d]" htmlFor="assignment-grade">
              Grade Level
            </label>
            <input
              id="assignment-grade"
              type="text"
              placeholder="e.g 10th, 12th, University"
              value={values.gradeLevel}
              onChange={(event) => updateDraft({ gradeLevel: event.target.value })}
              className="h-11 w-full rounded-full border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#2d2d2d] outline-none placeholder:text-[#b3b3b3] focus:border-[#b8b8b8]"
            />
            {errors.gradeLevel ? <p className="text-xs text-red-600">{errors.gradeLevel}</p> : null}
          </div>

          <div className="grid gap-3">
            <label className="text-base font-bold tracking-[-0.04em] text-[#2d2d2d]" htmlFor="assignment-due-date">
              Due Date
            </label>
            <div className="relative">
              <input
                id="assignment-due-date"
                type="date"
                value={values.dueDate}
                onChange={(event) => updateDraft({ dueDate: event.target.value })}
                className="h-11 w-full rounded-full border border-[#d9d9d9] bg-transparent px-4 pr-12 text-sm font-medium text-[#2d2d2d] outline-none placeholder:text-[#b3b3b3] focus:border-[#b8b8b8]"
              />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-[#2d2d2d]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="5" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M8 3v4M16 3v4M8 12h8M12 8v8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </div>
            {errors.dueDate ? <p className="text-xs text-red-600">{errors.dueDate}</p> : null}
          </div>

          <div className="grid gap-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_34px_114px_114px] md:items-center">
            <h2 className="text-base font-bold tracking-[-0.04em] text-[#2d2d2d]">Question Type</h2>
            <span className="hidden md:block" />
            <h2 className="hidden text-center text-base font-medium tracking-[-0.04em] text-[#2d2d2d] md:block">No. of Questions</h2>
            <h2 className="hidden text-center text-base font-medium tracking-[-0.04em] text-[#2d2d2d] md:block">Marks</h2>
          </div>

          <div className="grid gap-4">
            {values.questionConfigs.map((config) => (
              <QuestionRow key={config.id} config={config} onChange={setQuestionConfig} />
            ))}
          </div>

          {errors.questionConfigs ? (
            <p className="text-sm text-red-600">{errors.questionConfigs}</p>
          ) : null}

          <button
            type="button"
            className="mt-1 flex w-fit items-center gap-2 text-sm font-bold text-[#2d2d2d]"
            onClick={() => {
              const firstZero = values.questionConfigs.find((config) => config.count === 0);
              if (firstZero) setQuestionConfig(firstZero.id, { count: 1 });
            }}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#242528] text-3xl font-light leading-none text-white">
              +
            </span>
            Add Question Type
          </button>
        </div>

        <div className="ml-auto grid w-fit gap-2 text-right text-base font-medium tracking-[-0.04em] text-[#2d2d2d]">
          <p>Total Questions : {totalQuestions}</p>
          <p>Total Marks: {totalMarks}</p>
        </div>

        <div className="grid gap-3">
          <label className="text-base font-bold tracking-[-0.04em] text-[#2d2d2d]" htmlFor="assessment-requirements">
            Assessment Requirements
          </label>
          <div className="relative">
            <textarea
              id="assessment-requirements"
              placeholder="Describe your assessment — e.g This is a 3-hour final exam for Grade 10 students covering chapters 1-5 of the textbook. Include topics like photosynthesis, cell division, and genetics."
              value={values.instructions}
              onChange={(event) => updateDraft({ instructions: event.target.value })}
              className="min-h-[102px] w-full resize-none rounded-[16px] border border-dashed border-[#dedede] bg-[#f6f6f6] px-4 py-4 pr-14 text-sm font-medium text-[#2d2d2d] outline-none placeholder:text-[#777] focus:border-[#c4c4c4]"
            />
            <button
              type="button"
              aria-label="Voice input"
              className="absolute bottom-5 right-5 flex size-9 items-center justify-center rounded-full bg-white text-[#2d2d2d]"
            >
              <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
                  fill="currentColor"
                />
                <path
                  d="M18 11a6 6 0 0 1-12 0M12 17v4M9 21h6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          {errors.instructions ? <p className="text-xs text-red-600">{errors.instructions}</p> : null}
        </div>

        {errors.form ? (
          <div className="grid gap-1 text-xs text-red-600">
            <p>{errors.form}</p>
          </div>
        ) : null}
        </div>
      </div>

      {renderActions ? (
        renderActions({ submit, isGenerating })
      ) : (
        <button
          type="button"
          onClick={submit}
          disabled={isGenerating}
          className="ml-auto mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-[#242528] px-7 text-sm font-bold text-white transition hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? <LoadingSpinner /> : null}
          Generate question paper
        </button>
      )}
    </div>
  );
}
