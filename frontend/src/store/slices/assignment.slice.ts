import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUESTION_TYPE_OPTIONS } from "@/constants/question-types";
import type { Assignment, AssignmentFormValues, GenerationStatus } from "@/types/assignment";
import type { QuestionPaper } from "@/types/question-paper";

type AssignmentState = {
  draft: AssignmentFormValues;
  assignments: Assignment[];
  papers: QuestionPaper[];
  progressByAssignment: Record<string, number>;
  messageByAssignment: Record<string, string>;
  updateDraft: (patch: Partial<AssignmentFormValues>) => void;
  resetDraft: () => void;
  createAssignment: (values: AssignmentFormValues) => Assignment;
  updateStatus: (
    assignmentId: string,
    status: GenerationStatus,
    progress: number,
    message: string,
    paperId?: string
  ) => void;
  savePaper: (paper: QuestionPaper) => void;
  getAssignment: (id: string) => Assignment | undefined;
  getPaper: (id: string) => QuestionPaper | undefined;
};

const defaultDraft: AssignmentFormValues = {
  title: "",
  subject: "",
  className: "",
  dueDate: "",
  uploadedFileName: undefined,
  sourceText: "",
  questionConfigs: QUESTION_TYPE_OPTIONS,
  instructions: "",
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useAssignmentStore = create<AssignmentState>()(
  persist(
    (set, get) => ({
      draft: defaultDraft,
      assignments: [],
      papers: [],
      progressByAssignment: {},
      messageByAssignment: {},
      updateDraft: (patch) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...patch,
          },
        })),
      resetDraft: () => set({ draft: defaultDraft }),
      createAssignment: (values) => {
        const assignment: Assignment = {
          ...values,
          id: createId("assignment"),
          status: "queued",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          assignments: [assignment, ...state.assignments],
          progressByAssignment: {
            ...state.progressByAssignment,
            [assignment.id]: 8,
          },
          messageByAssignment: {
            ...state.messageByAssignment,
            [assignment.id]: "Queued for AI generation",
          },
        }));

        return assignment;
      },
      updateStatus: (assignmentId, status, progress, message, paperId) =>
        set((state) => ({
          assignments: state.assignments.map((assignment) =>
            assignment.id === assignmentId
              ? {
                  ...assignment,
                  status,
                  paperId: paperId ?? assignment.paperId,
                }
              : assignment
          ),
          progressByAssignment: {
            ...state.progressByAssignment,
            [assignmentId]: progress,
          },
          messageByAssignment: {
            ...state.messageByAssignment,
            [assignmentId]: message,
          },
        })),
      savePaper: (paper) =>
        set((state) => ({
          papers: [paper, ...state.papers.filter((item) => item.id !== paper.id)],
          assignments: state.assignments.map((assignment) =>
            assignment.id === paper.assignmentId
              ? { ...assignment, paperId: paper.id, status: "completed" }
              : assignment
          ),
        })),
      getAssignment: (id) => get().assignments.find((assignment) => assignment.id === id),
      getPaper: (id) => get().papers.find((paper) => paper.id === id),
    }),
    {
      name: "veda-ai-assessment-store",
      partialize: (state) => ({
        draft: state.draft,
        assignments: state.assignments,
        papers: state.papers,
        progressByAssignment: state.progressByAssignment,
        messageByAssignment: state.messageByAssignment,
      }),
    }
  )
);
