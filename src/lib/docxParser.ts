import mammoth from "mammoth";

export interface ParsedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

/**
 * Parse DOCX file and extract questions in JSON format
 * Handles format where text is concatenated without line breaks:
 * "Question 1: What is 2 + 2?A) 5B) 4C) 3D) 2Answer: 1Question 2: ..."
 */
export async function parseDocxFile(file: File): Promise<ParsedQuestion[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    return extractQuestionsFromText(text);
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to parse DOCX file");
  }
}

/**
 * Extract questions from concatenated text
 * Handles format: "Question 1: ...A) ...B) ...C) ...D) ...Answer: XQuestion 2: ..."
 */
function extractQuestionsFromText(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // First, normalize the text - add spaces before "Question" and "Answer"
  // This helps us split properly
  let normalized = text
    .replace(/Question\s+(\d+):/g, "\n|||QUESTION|||$1:")
    .replace(/Answer:\s*([A-D]|\d)/gi, "\n|||ANSWER|||$1");

  // Split by question markers
  const questionBlocks = normalized.split("|||QUESTION|||").slice(1);

  for (const block of questionBlocks) {
    try {
      const parts = block.split("|||ANSWER|||");
      if (parts.length < 2) continue;

      const questionPart = parts[0];
      const answerPart = parts[1];

      // Extract question text (everything after the number and colon)
      const questionMatch = questionPart.match(/^\d+:\s*(.+?)(?=[A-D]\))/);
      if (!questionMatch) continue;

      const questionText = questionMatch[1].trim();

      // Extract options - look for pattern like "A) text" or "A)text"
      const optionMatches = questionPart.match(/[A-D]\)\s*([^A-D)]*?)(?=[A-D]\)|$)/gi);
      if (!optionMatches || optionMatches.length < 2) continue;

      const options: string[] = [];
      for (const optMatch of optionMatches) {
        // Remove the letter and parenthesis, keep the text
        const optText = optMatch.replace(/^[A-D]\)\s*/i, "").trim();
        if (optText) {
          options.push(optText);
        }
      }

      // Extract correct answer
      const answerMatch = answerPart.match(/^([A-D]|\d)/i);
      if (!answerMatch) continue;

      let correctAnswer = 0;
      const answerValue = answerMatch[1].toUpperCase();

      // If answer is a letter (A, B, C, D), convert to index
      if (/^[A-D]$/.test(answerValue)) {
        correctAnswer = answerValue.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      } else {
        // If answer is a number, use it directly
        correctAnswer = parseInt(answerValue, 10);
      }

      // Validate
      if (questionText && options.length >= 2 && correctAnswer >= 0 && correctAnswer < options.length) {
        questions.push({
          question: questionText,
          options,
          correctAnswer,
        });
      }
    } catch (e) {
      console.error("Error parsing question block:", e);
      continue;
    }
  }

  return questions;
}

/**
 * Validate parsed questions
 */
export function validateQuestions(questions: ParsedQuestion[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push("No questions found");
    return { valid: false, errors };
  }

  questions.forEach((q, idx) => {
    if (!q.question || q.question.trim() === "") {
      errors.push(`Question ${idx + 1}: Missing question text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push(`Question ${idx + 1}: Must have at least 2 options`);
    }
    if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      errors.push(`Question ${idx + 1}: Invalid correct answer index (${q.correctAnswer})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}