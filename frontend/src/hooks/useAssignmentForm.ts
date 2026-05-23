"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { assignmentSchema } from "@/lib/validators/assignment.schema";
import { useAssignmentStore } from "@/store";
import type { AssignmentFormValues, QuestionConfig } from "@/types/assignment";
import type { Difficulty, QuestionPaper, QuestionSection } from "@/types/question-paper";

type FieldErrors = Partial<Record<keyof AssignmentFormValues | "form", string>>;

const difficultyCycle: Difficulty[] = ["easy", "medium", "hard"];

function sectionTitle(index: number, config: QuestionConfig) {
  return `Section ${String.fromCharCode(65 + index)} - ${config.label}`;
}

function questionText(index: number, config: QuestionConfig, subject: string, sourceText: string) {
  const anchor = sourceText.trim().split(/\s+/).slice(0, 10).join(" ");
  const topic = anchor ? ` based on "${anchor}..."` : "";

  if (config.id === "mcq") {
    return `Choose the correct answer for ${subject}${topic}.`;
  }

  if (config.id === "case-study") {
    return `Read the given context and answer the applied ${subject} case question ${index + 1}.`;
  }

  return `Answer question ${index + 1} in ${subject}${topic}.`;
}

function buildMockPaper(values: AssignmentFormValues, assignmentId: string): QuestionPaper {
  const sections: QuestionSection[] = values.questionConfigs
    .filter((config) => config.count > 0)
    .map((config, sectionIndex) => ({
      id: `${assignmentId}-section-${config.id}`,
      title: sectionTitle(sectionIndex, config),
      instruction:
        config.id === "long" || config.id === "case-study"
          ? "Attempt any one unless instructed otherwise by your teacher."
          : "Attempt all questions.",
      questions: Array.from({ length: config.count }, (_, questionIndex) => ({
        id: `${assignmentId}-${config.id}-${questionIndex}`,
        text: questionText(questionIndex, config, values.subject, values.sourceText),
        type: config.label,
        difficulty: difficultyCycle[(sectionIndex + questionIndex) % difficultyCycle.length],
        marks: config.marks,
      })),
    }));

  const totalMarks = sections.reduce(
    (sum, section) =>
      sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
    0
  );

  return {
    id: `paper-${assignmentId}`,
    assignmentId,
    title: values.title,
    subject: values.subject,
    className: values.className,
    dueDate: values.dueDate,
    durationMinutes: Math.max(30, Math.ceil(totalMarks * 2.5)),
    totalMarks,
    sections,
    createdAt: new Date().toISOString(),
  };
}

export function useAssignmentForm() {
  const router = useRouter();
  const draft = useAssignmentStore((state) => state.draft);
  const updateDraft = useAssignmentStore((state) => state.updateDraft);
  const resetDraft = useAssignmentStore((state) => state.resetDraft);
  const createAssignment = useAssignmentStore((state) => state.createAssignment);
  const updateStatus = useAssignmentStore((state) => state.updateStatus);
  const savePaper = useAssignmentStore((state) => state.savePaper);
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
      if (key) nextErrors[key] = issue.message;
      else nextErrors.form = issue.message;
    }

    setErrors(nextErrors);
    return false;
  }

  function submit() {
    if (!validate(draft)) return;

    setIsGenerating(true);
    const assignment = createAssignment(draft);

    window.setTimeout(() => {
      updateStatus(assignment.id, "generating", 42, "Structuring prompt and section blueprint");
    }, 500);

    window.setTimeout(() => {
      updateStatus(assignment.id, "generating", 78, "Generating questions and validating schema");
    }, 1100);

    window.setTimeout(() => {
      const paper = buildMockPaper(draft, assignment.id);
      savePaper(paper);
      updateStatus(assignment.id, "completed", 100, "Question paper ready", paper.id);
      resetDraft();
      router.push(routes.output(paper.id));
    }, 1700);
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
