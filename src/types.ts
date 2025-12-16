export interface Question {
  id: string;
  ticketNumber: number;
  question: string;
  answer: string;
  distractors?: string[];
}

export interface QuizState {
  mode: 'MENU' | 'QUIZ' | 'FILL_BLANK';
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, boolean>; // id -> correct/incorrect
}

export type GameMode = 'QUIZ' | 'FILL_BLANK';
