import api from './authService';
import { User, QuizReport } from './types';
import { AxiosResponse } from 'axios';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/users/profile');
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await api.get('/users/list');
    return response.data;
  },

  getUserReport: async (userId: number): Promise<QuizReport[]> => {
    const response: AxiosResponse<QuizReport[]> = await api.get(`/users/${userId}/report`);
    return response.data;
  },
};
