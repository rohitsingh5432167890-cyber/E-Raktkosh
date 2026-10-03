import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  registerDonor: async (formData) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: formData
    });
  },

  getMe: async () => {
    return apiClient('/auth/me');
  }
};

export default authApi;
