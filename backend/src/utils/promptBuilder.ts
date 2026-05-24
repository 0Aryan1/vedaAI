import type { IAssignment } from "../types/assignment.types";

export const buildPrompt = (assignment: IAssignment): string => {
  const sections = assignment.sections
    .map(
      (section, index) => `
${index + 1}. ${section.name}
   - section id: ${String.fromCharCode(65 + index)}
   - question type: ${section.questionType}
   - number of questions: ${section.numberOfQuestions}
   - marks per question: ${section.marksPerQuestion}
   - difficulty: ${section.difficulty}`
    )
    .join("\n");

  const sourceMaterial = assignment.extractedText
    ? `
SOURCE MATERIAL:
Use this content as the primary basis for the questions:
${assignment.extractedText}`
    : "No extracted source material was provided. Generate curriculum-appropriate questions.";

  return `
Generate a complete question paper for the following assignment.

ASSIGNMENT:
- title: ${assignment.title}
- subject: ${assignment.subject}
- grade level: ${assignment.gradeLevel}
- total marks: ${assignment.totalMarks}
- additional instructions: ${assignment.additionalInstructions || "None"}

SECTIONS TO GENERATE:
${sections}

${sourceMaterial}

STRICT REQUIREMENTS:
1. Create exactly the sections listed above.
2. For each section, generate exactly numberOfQuestions questions.
3. Every question must match the specified questionType and difficulty for its section.
4. Every question must include id, text, type, difficulty, marks, options, and correctAnswer.
5. MCQ questions must have exactly 4 options and correctAnswer must be the zero-based index of the correct option.
6. Non-MCQ questions must use options: null and correctAnswer: null.
7. Use section ids as "A", "B", "C", etc. Use question ids as "A1", "A2", "B1", etc.
8. Return ONLY a valid JSON object. Do not include markdown, explanation, prose, or code fences.

JSON STRUCTURE:
{
  "title": string,
  "subject": string,
  "gradeLevel": string,
  "totalMarks": number,
  "duration": string,
  "sections": [
    {
      "id": string,
      "title": string,
      "instruction": string,
      "questions": [
        {
          "id": string,
          "text": string,
          "type": string,
          "difficulty": string,
          "marks": number,
          "options": string[] | null,
          "correctAnswer": number | null
        }
      ]
    }
  ]
}
`.trim();
};
