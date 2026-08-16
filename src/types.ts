export type Difficulty = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'all';

export type SkillCategory = 'doc_hieu' | 'luyen_tu_va_cau' | 'viet' | 'noi_va_nghe';

export interface Lesson {
  id: number;
  title: string;
  themeId: string;
  themeTitle: string;
  week: number;
  pages: string;
  type: 'doc' | 'review';
  grammarFocus?: string;
  writingFocus?: string;
  speakingFocus?: string;
}

export interface Question {
  id: string;
  lessonId: number;
  lessonTitle: string;
  themeId: string;
  themeTitle: string;
  difficulty: 'nhan_biet' | 'thong_hieu' | 'van_dung';
  difficultyLabel: string;
  category: SkillCategory;
  categoryLabel: string;
  passage?: string;
  passageAuthor?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  textbookQuote?: string;
  hint?: string;
  pageReference?: number;
}

export interface QuizConfig {
  studentName: string;
  studentClass: string;
  selectedLessonId: number | 'all' | 'theme1' | 'theme2' | 'theme3' | 'theme4' | 'midterm' | 'final';
  difficulty: Difficulty;
  questionCount: number;
  mode: 'practice' | 'test'; // Practice: immediate feedback; Test: timed exam
  timePerQuestionSeconds?: number;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResult {
  studentName: string;
  studentClass: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scoreTenScale: number; // 0 - 10
  percentage: number;
  gradeEvaluation: string;
  tutorComment: string;
  timeElapsedSeconds: number;
  answers: UserAnswer[];
  questions: Question[];
  timestamp: string;
  certificateId: string;
}

export interface GrammarItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  rules: string[];
  examples: string[];
  page: number;
}
