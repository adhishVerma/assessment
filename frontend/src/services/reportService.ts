// services/reportService.ts

import api from "./authService";
import { QuizReport, SkillGap, TimeFilter } from "./types";
import { AxiosResponse } from "axios";

export const reportService = {
  // Get user's quiz report with optional time filtering
  getUserReport: async (
    userId: number,
    filter: TimeFilter = "all"
  ): Promise<QuizReport> => {
    const response: AxiosResponse<{ success: boolean; data: QuizReport }> =
      await api.get(`/reports/user/${userId}`, { params: { filter } });
    return response.data.data;
  },

  // Get user's skill gaps with optional time filtering
  getSkillGaps: async (
    userId: number,
    filter: TimeFilter = "all"
  ): Promise<SkillGap[]> => {
    const response: AxiosResponse<{ success: boolean; data: SkillGap[] }> =
      await api.get(`/reports/skill-gaps/${userId}`, { params: { filter } });
    return response.data.data;
  },

  // Get comparative analysis for a user
  getComparativeReport: async (userId: number): Promise<any> => {
    const response: AxiosResponse<{ success: boolean; data: any }> =
      await api.get(`/reports/comparative/${userId}`);
    return response.data.data;
  },
};
