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
5. MCQ questions must have exactly 4 options (array of strings) and correctAnswer must be the zero-based index (0, 1, 2, or 3).
6. Non-MCQ questions must have options: null and correctAnswer: null.
7. difficulty must be exactly one of: "easy", "medium", "hard" (lowercase only).
8. marks must be a positive integer.
9. Use section ids as "A", "B", "C", etc. Use question ids as "A1", "A2", "B1", etc.
10. Return ONLY a valid JSON object. Do not include markdown, explanation, prose, code fences, or any text outside the JSON.
11. Every field must be present — do not omit any field from the schema.
12. All string fields must be non-empty.

JSON STRUCTURE (strictly follow this):
{
  "title": "string - paper title",
  "subject": "string - subject name",
  "gradeLevel": "string - grade/class level",
  "totalMarks": "number - sum of all question marks",
  "duration": "string - e.g., '3 hours'",
  "sections": [
    {
      "id": "string - e.g., 'A'",
      "title": "string - section title",
      "instruction": "string - instructions for this section",
      "questions": [
        {
          "id": "string - e.g., 'A1'",
          "text": "string - the question text",
          "type": "string - question type (mcq, short, essay, etc)",
          "difficulty": "string - must be 'easy', 'medium', or 'hard'",
          "marks": "number - marks for this question",
          "options": "string[] or null - exactly 4 strings for MCQ, null for others",
          "correctAnswer": "number or null - 0/1/2/3 for MCQ, null for others"
        }
      ]
    }
  ]
}
`.trim();
};
