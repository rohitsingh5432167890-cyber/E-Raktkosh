import { apiClient } from './client';

export const publicApi = {
  getHealth: async () => {
    return apiClient('/public/health');
  },

  getStats: async () => {
    return apiClient('/public/stats');
  },

  getStates: async () => {
    return apiClient('/public/states');
  },

  getDistricts: async (state) => {
    return apiClient('/public/districts', {
      params: { state }
    });
  },

  searchStock: async (filters = {}) => {
    return apiClient('/public/stock', {
      params: filters
    });
  },

  getBloodBanks: async (filters = {}) => {
    return apiClient('/public/blood-banks', {
      params: filters
    });
  },

  getBloodBankById: async (id) => {
    return apiClient(`/public/blood-banks/${id}`);
  },

  getCamps: async (filters = {}) => {
    return apiClient('/public/camps', {
      params: filters
    });
  },

  getEmergencyRequests: async (filters = {}) => {
    return apiClient('/public/emergency', {
      params: filters
    });
  },

  createEmergencyRequest: async (data) => {
    return apiClient('/public/emergency', {
      method: 'POST',
      body: data
    });
  },

  verifyCertificate: async (certificateId) => {
    return apiClient(`/public/verify-certificate/${encodeURIComponent(certificateId)}`);
  }
};

export default publicApi;
