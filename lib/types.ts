export type Topic = "Mixed" | "OS" | "Networks" | "DBMS" | "OOP" | "DSA Theory";

export interface Question {
  id?: string;
  topic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface DrillStats {
  score: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  currentStreak: number;
  maxStreak: number;
}
