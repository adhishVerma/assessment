import api from './authService';
import { Skill, SkillFormData } from './types';
import { AxiosResponse } from 'axios';

export const skillService = {
  getAll: async (): Promise<Skill[]> => {
    const response: AxiosResponse<Skill[]> = await api.get('/skills');
    return response.data;
  },

  getById: async (id: number): Promise<Skill> => {
    const response: AxiosResponse<Skill> = await api.get(`/skills/${id}`);
    return response.data;
  },

  create: async (skillData: SkillFormData): Promise<Skill> => {
    const response: AxiosResponse<Skill> = await api.post('/skills', skillData);
    return response.data;
  },

  update: async (id: number, skillData: Partial<SkillFormData>): Promise<Skill> => {
    const response: AxiosResponse<Skill> = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },
};
