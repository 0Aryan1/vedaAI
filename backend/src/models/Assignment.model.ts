import mongoose, { Schema, type HydratedDocument } from "mongoose";
import { DIFFICULTY, QUESTION_TYPES } from "../constants";
import type { IAssignment, SectionConfig } from "../types/assignment.types";

export type AssignmentDocument = HydratedDocument<IAssignment>;

const sectionConfigSchema = new Schema<SectionConfig>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      required: true,
      enum: Object.values(QUESTION_TYPES),
    },
    numberOfQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    marksPerQuestion: {
      type: Number,
      required: true,
      min: 1,
    },
    difficulty: {
      type: String,
      required: true,
      enum: Object.values(DIFFICULTY),
    },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    gradeLevel: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    sections: {
      type: [sectionConfigSchema],
      required: true,
      validate: {
        validator: (sections: SectionConfig[]) => sections.length > 0,
        message: "At least one section is required",
      },
    },
    additionalInstructions: {
      type: String,
      trim: true,
    },
    extractedText: {
      type: String,
    },
    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "processing", "completed", "failed"],
      default: "draft",
    },
    jobId: {
      type: String,
    },
    paperId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionPaper",
    },
  },
  { timestamps: true }
);

assignmentSchema.pre("save", function computeTotalMarks() {
  this.totalMarks = this.sections.reduce(
    (sum, section) => sum + section.numberOfQuestions * section.marksPerQuestion,
    0
  );
});

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
