export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface UserItem {
  id: number;
  name: string;
  email: string;
  testsCompleted: number;
  avgScore: number;
  lastTestDate?: string;
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
  questionText: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
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
  selectedOption: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  question?: Question;
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
  id: number;
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
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  skillId: number;
}

export interface SkillFormData {
  name: string;
  description: string;
}

// Add to your existing types file

export interface SkillGap {
  skillId: number;
  skillName: string;
  averageScore: number;
  quizzesTaken: number;
  lastAttempted: string;
  status: "critical" | "needs-improvement" | "good" | "excellent";
  trend: "improving" | "declining" | "stable";
}

// Extend the existing QuizReport topicWise type for your usage
export interface TopicWiseReportItem {
  quizId: number;
  skillName: string;
  skillDescription: string | null;
  total: number;
  correct: number;
  scorePercent: number;
  createdAt: Date;
}

// Adjust QuizReport interface to use TopicWiseReportItem
export interface QuizReport {
  totalQuizzes: number;
  averageScore: number;
  excellentScore: number;
  topicWise: TopicWiseReportItem[];
  skillGaps?: SkillGap[]; // Optional inclusion if present in your API responses
  recentActivity?: {
    week: number;
    month: number;
    total: number;
  };
}

// TimeFilter type for query parameters in your reports API calls
export type TimeFilter = "week" | "month" | "all";
