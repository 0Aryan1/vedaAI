"use client";

import { useMemo, useState } from "react";
import { assignmentApi, convertFormToPayload } from "@/lib/api/assignments";
import { joinJobRoom } from "@/lib/socket/client";
import { assignmentSchema } from "@/lib/validators/assignment.schema";
import { useAssignmentStore } from "@/store";
import type { AssignmentFormValues, QuestionConfig } from "@/types/assignment";

type FieldErrors = Partial<Record<keyof AssignmentFormValues | "form", string>>;

export function useAssignmentForm() {
  const draft = useAssignmentStore((state) => state.draft);
  const updateDraft = useAssignmentStore((state) => state.updateDraft);
  const createAssignment = useAssignmentStore((state) => state.createAssignment);
  const updateStatus = useAssignmentStore((state) => state.updateStatus);
  const setAssignmentJobId = useAssignmentStore((state) => state.setAssignmentJobId);
  const resetDraft = useAssignmentStore((state) => state.resetDraft);
  const clearCompletedAssignments = useAssignmentStore((state) => state.clearCompletedAssignments);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const totalQuestions = useMemo(
    () => draft.questionConfigs.reduce((sum, config) => sum + Number(config.count || 0), 0),
    [draft.questionConfigs]
  );

  const totalMarks = useMemo(
    () =>
      draft.questionConfigs.reduce(
        (sum, config) => sum + Number(config.count || 0) * Number(config.marks || 0),
        0
      ),
    [draft.questionConfigs]
  );

  function setQuestionConfig(id: QuestionConfig["id"], patch: Partial<QuestionConfig>) {
    updateDraft({
      questionConfigs: draft.questionConfigs.map((config) =>
        config.id === id ? { ...config, ...patch } : config
      ),
    });
  }

  function validate(values: AssignmentFormValues) {
    const result = assignmentSchema.safeParse(values);

    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof AssignmentFormValues | undefined;
      if (key) {
        nextErrors[key] = issue.message;
      }
      else {
        nextErrors.form = issue.message;
      }
    }

    setErrors(nextErrors);
    return false;
  }

  async function submit() {
    const valuesForSubmit: AssignmentFormValues = {
      title: (draft.title ?? '').trim() || 'Create Assignment',
      subject: (draft.subject ?? '').trim() || 'General',
      gradeLevel: (draft.gradeLevel ?? '').trim() || 'General',
      dueDate: draft.dueDate ?? '',
      instructions: draft.instructions ?? '',
      questionConfigs: draft.questionConfigs,
    };

    if (!validate(valuesForSubmit)) {
      return;
    }

    setIsGenerating(true);

    try {
      const payload = convertFormToPayload(valuesForSubmit);
      const { jobId } = await assignmentApi.create(payload);

      resetDraft();

      clearCompletedAssignments();

      const localAssignment = createAssignment(valuesForSubmit);
      setAssignmentJobId(localAssignment.id, jobId);
      updateStatus(localAssignment.id, "processing", 0, "Job queued...");
      
      joinJobRoom(jobId);
      
      setIsGenerating(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create assignment";
      console.error('[Form] Submission failed:', message);
      setErrors({ form: message });
      setIsGenerating(false);
      resetDraft();
    }
  }

  return {
    values: draft,
    errors,
    isGenerating,
    totalQuestions,
    totalMarks,
    updateDraft,
    setQuestionConfig,
    submit,
  };
}
