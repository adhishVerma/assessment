import api from './authService';
import { Question, QuestionFormData } from './types';
import { AxiosResponse } from 'axios';

export const questionService = {
  getAll: async (): Promise<Question[]> => {
    const response: AxiosResponse<Question[]> = await api.get('/questions');
    return response.data;
  },

  getBySkill: async (skillId: number): Promise<Question[]> => {
    const response: AxiosResponse<Question[]> = await api.get(`/questions?skillId=${skillId}`);
    return response.data;
  },

  create: async (questionData: QuestionFormData): Promise<Question> => {
    const response: AxiosResponse<Question> = await api.post('/questions', questionData);
    return response.data;
  },

  update: async (id: number, questionData: Partial<QuestionFormData>): Promise<Question> => {
    const response: AxiosResponse<Question> = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },
};
