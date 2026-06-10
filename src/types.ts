export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Ticket {
  id: number;
  title: string;
  difficulty: 1 | 2 | 3;
  questions: Question[];
}
