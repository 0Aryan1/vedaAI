"use client";

import { FileUpload } from "@/components/assignment/FileUpload";
import { InstructionsInput } from "@/components/assignment/InstructionsInput";
import { MarksConfig } from "@/components/assignment/MarksConfig";
import { QuestionTypeSelector } from "@/components/assignment/QuestionTypeSelector";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { useAssignmentForm } from "@/hooks/useAssignmentForm";

export function AssignmentForm() {
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
    <div className="w-full">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-slate-950">Assignment Details</h1>
          <p className="mt-1 text-sm text-slate-500">Basic information about your assignment</p>
        </CardHeader>
        <CardBody className="grid gap-8">
          {/* File Upload Section */}
          <FileUpload
            fileName={values.uploadedFileName}
            error={errors.sourceText}
            onFileNameChange={(uploadedFileName) => updateDraft({ uploadedFileName })}
          />

          {/* Basic Details */}
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Assignment title"
                placeholder="Chapter 4 assessment"
                value={values.title}
                error={errors.title}
                onChange={(event) => updateDraft({ title: event.target.value })}
              />
              <Input
                label="Subject"
                placeholder="Science"
                value={values.subject}
                error={errors.subject}
                onChange={(event) => updateDraft({ subject: event.target.value })}
              />
              <Input
                label="Class / Grade"
                placeholder="Grade 8"
                value={values.className}
                error={errors.className}
                onChange={(event) => updateDraft({ className: event.target.value })}
              />
              <Input
                label="Due date"
                type="date"
                value={values.dueDate}
                error={errors.dueDate}
                onChange={(event) => updateDraft({ dueDate: event.target.value })}
              />
            </div>

            {/* Source Text */}
            <Textarea
              label="Paste source material"
              placeholder="Paste chapter notes, learning objectives, or copied text from a PDF."
              value={values.sourceText}
              error={errors.sourceText}
              onChange={(event) => updateDraft({ sourceText: event.target.value })}
            />
          </div>

          {/* Question Type Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-950">Question Type</h3>
            <QuestionTypeSelector configs={values.questionConfigs} onChange={setQuestionConfig} />
            {errors.questionConfigs ? (
              <p className="mt-2 text-sm text-red-600">{errors.questionConfigs}</p>
            ) : null}
          </div>

          {/* Marks Configuration */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-950">No. of Questions</h3>
            <MarksConfig configs={values.questionConfigs} onChange={setQuestionConfig} />
          </div>

          {/* Additional Information */}
          <div className="border-t border-slate-200 pt-6">
            <InstructionsInput
              value={values.instructions}
              error={errors.instructions}
              onChange={(instructions) => updateDraft({ instructions })}
            />
          </div>

          {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}

          {/* Summary and Submit */}
          <div className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between gap-4">
                <span className="text-sm font-medium text-slate-600">Total Questions :</span>
                <span className="font-semibold text-slate-950">{totalQuestions}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm font-medium text-slate-600">Total Marks :</span>
                <span className="font-semibold text-slate-950">{totalMarks}</span>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <Button type="button" onClick={submit} disabled={isGenerating} className="w-full sm:w-auto">
                {isGenerating ? <LoadingSpinner /> : null}
                Generate question paper
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
