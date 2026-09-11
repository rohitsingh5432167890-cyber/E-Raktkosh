import { apiClient } from './client';

export const donorApi = {
  getProfile: async () => {
    return apiClient('/donor/profile');
  },

  updateProfile: async (data) => {
    return apiClient('/donor/profile', {
      method: 'PUT',
      body: data
    });
  },

  getHistory: async () => {
    return apiClient('/donor/history');
  },

  getDigitalPass: async () => {
    return apiClient('/donor/pass');
  },

  registerForCamp: async (campId) => {
    return apiClient(`/donor/camps/${campId}/register`, {
      method: 'POST'
    });
  }
};

export default donorApi;
