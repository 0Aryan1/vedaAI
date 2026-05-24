import mongoose, { Schema } from "mongoose";
import type { QuestionPaper as ParsedQuestionPaper } from "../utils/responseParser";

type QuestionPaperDocument = ParsedQuestionPaper & {
  assignmentId: mongoose.Types.ObjectId;
  generatedAt: Date;
};

const questionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    marks: { type: Number, required: true },
    options: { type: [String], default: null },
    correctAnswer: { type: Number, default: null },
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false }
);

const questionPaperSchema = new Schema<QuestionPaperDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    duration: { type: String, required: true },
    sections: { type: [sectionSchema], required: true },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const QuestionPaper = mongoose.model<QuestionPaperDocument>(
  "QuestionPaper",
  questionPaperSchema
);
