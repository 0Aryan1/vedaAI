export interface SectionConfig {
  name: string;
  questionType: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  difficulty: string;
}

export interface IAssignment {
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: Date;
  sections: SectionConfig[];
  additionalInstructions?: string;
  extractedText?: string;
  totalMarks: number;
  status: "draft" | "processing" | "completed" | "failed";
  jobId?: string;
  paperId?: string;
}
