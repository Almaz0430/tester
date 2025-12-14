import type { Question } from '../types';

/**
 * Shuffles an array using Fisher-Yates algorithm.
 */
export function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * Generates distractors for a multiple choice question.
 * Returns an array of 4 answers (1 correct, 3 wrong).
 */
export function generateQuizOptions(current: Question, allQuestions: Question[]) {
  const otherAnswers = allQuestions
    .filter(q => q.id !== current.id)
    .map(q => q.answer);

  const distractors = shuffle(otherAnswers).slice(0, 3);
  return shuffle([current.answer, ...distractors]);
}

/**
 * Prepares a "Fill in the Blank" challenge.
 * Hides key terms in the answer.
 */
export function generateFillBlank(text: string) {
  // Simple heuristic: hide capitalized words that aren't at the start of sentence,
  // or words inside quotes, or known key terms.
  // For simplicity, let's randomly hide 1-2 words that are longer than 4 chars.

  const words = text.split(' ');
  const indicesToHide = new Set<number>();

  // Find candidates (long words)
  const candidates = words.map((w, i) => ({ w, i })).filter(item => item.w.replace(/[.,]/g, '').length > 5);

  if (candidates.length > 0) {
    const count = Math.min(2, candidates.length);
    const shuffled = shuffle(candidates);
    for (let i = 0; i < count; i++) {
      indicesToHide.add(shuffled[i].i);
    }
  }

  const parts = words.map((w, i) => ({
    text: w,
    hidden: indicesToHide.has(i),
    clean: w.replace(/[.,:;()]/g, '') // version to verify against
  }));

  return parts;
}
