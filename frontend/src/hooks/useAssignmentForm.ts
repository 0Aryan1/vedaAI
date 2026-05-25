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
    console.log('[Validate] Starting validation with values:', JSON.stringify(values, null, 2));
    
    const result = assignmentSchema.safeParse(values);

    if (result.success) {
      console.log('[Validate] ✅ Validation successful');
      setErrors({});
      return true;
    }

    console.log('[Validate] ❌ Validation failed, issues:', result.error.issues);
    
    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof AssignmentFormValues | undefined;
      if (key) {
        nextErrors[key] = issue.message;
        console.log(`[Validate] Error in ${String(key)}: ${issue.message}`);
      }
      else {
        nextErrors.form = issue.message;
        console.log(`[Validate] Form error: ${issue.message}`);
      }
    }

    setErrors(nextErrors);
    return false;
  }

  async function submit() {
    console.log('[Submit] Called, draft:', JSON.stringify(draft, null, 2));
    
    const valuesForSubmit: AssignmentFormValues = {
      title: (draft.title ?? '').trim() || 'Create Assignment',
      subject: (draft.subject ?? '').trim() || 'General',
      gradeLevel: (draft.gradeLevel ?? '').trim() || 'General',
      dueDate: draft.dueDate ?? '',
      instructions: draft.instructions ?? '',
      questionConfigs: draft.questionConfigs,
    };

    console.log('[Submit] valuesForSubmit:', JSON.stringify(valuesForSubmit, null, 2));

    if (!validate(valuesForSubmit)) {
      console.log('[Submit] Validation failed, errors:', errors);
      return;
    }
    
    console.log('[Submit] Validation passed, proceeding with API call');

    setIsGenerating(true);

    try {
      const payload = convertFormToPayload(valuesForSubmit);
      const { jobId } = await assignmentApi.create(payload);

      console.log('[Form] Assignment created, jobId:', jobId);

      // Reset form immediately after successful API call
      resetDraft();
      console.log('[Form] Draft reset');

      // Clear any previously completed assignments
      clearCompletedAssignments();
      console.log('[Form] Cleared completed assignments');

      const localAssignment = createAssignment(valuesForSubmit);
      setAssignmentJobId(localAssignment.id, jobId);
      updateStatus(localAssignment.id, "processing", 0, "Job queued...");
      
      console.log('[Form] Joining job room:', jobId);
      joinJobRoom(jobId);
      
      setIsGenerating(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create assignment";
      console.error('[Form] Submission failed:', message);
      setErrors({ form: message });
      setIsGenerating(false);
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
