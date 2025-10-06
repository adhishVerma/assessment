export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  skillId: number;
  skill?: Skill;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSession {
  id: number;
  userId: number;
  skillId: number;
  totalScore: number;
  startTime: string;
  endTime?: string;
  skill?: Skill;
  user?: User;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  sessionId: number;
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  question?: Question;
}

export interface QuizReport {
  quizId: number;
  total: number;
  correct: number;
  createdAt: string;
}

// API Response Types
export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface StartQuizResponse {
  sessionId: number;
  skillId: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface QuestionFormData {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  skillId: number;
}

export interface SkillFormData {
  name: string;
  description: string;
}
