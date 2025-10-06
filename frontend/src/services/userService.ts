import api from './authService';
import { User, QuizReport, UserItem } from './types';
import { AxiosResponse } from 'axios';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/user/profile');
    return response.data;
  },

  getAll: async (): Promise<UserItem[]> => {
    const response: AxiosResponse<UserItem[]> = await api.get('/user/list');
    console.log(response)
    return response.data;
  },

  getUserReport: async (userId: number): Promise<QuizReport[]> => {
    const response: AxiosResponse<QuizReport[]> = await api.get(`/user/${userId}/report`);
    return response.data;
  },
};
