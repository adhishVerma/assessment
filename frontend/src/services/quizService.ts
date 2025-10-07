import api from "./authService";
import { StartQuizResponse, SubmitAnswerResponse } from "./types";
import { AxiosResponse } from "axios";

export const quizService = {
  startSession: async (skillId: number): Promise<StartQuizResponse> => {
    const response: AxiosResponse<StartQuizResponse> = await api.post(
      `/quizzes/start/`,
      { skillId }
    );
    return response.data;
  },

  submitAnswer: async (
    sessionId: number,
    questionId: number,
    selectedOption: "A" | "B" | "C" | "D"
  ): Promise<SubmitAnswerResponse> => {
    const response: AxiosResponse<SubmitAnswerResponse> = await api.post(
      `/quizzes/submit`,
      { sessionId, questionId, selectedOption }
    );
    return response.data;
  },

  completeSession: async (sessionId: number): Promise<void> => {
    await api.post(`/quizzes/complete`, { sessionId });
  },
};
