export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Ticket {
  id: number;
  title: string;
  questions: Question[];
}
