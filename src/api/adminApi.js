import { apiClient } from './client';

export const adminApi = {
  getDashboard: async () => {
    return apiClient('/admin/dashboard');
  },

  getStock: async () => {
    return apiClient('/admin/stock');
  },

  updateStock: async (payload) => {
    return apiClient('/admin/stock', {
      method: 'PUT',
      body: payload
    });
  },

  verifyDonation: async (verificationData) => {
    return apiClient('/admin/verify-donation', {
      method: 'POST',
      body: verificationData
    });
  },

  getEmergencyRequests: async () => {
    return apiClient('/admin/emergency');
  },

  fulfillEmergency: async (requestId, payload) => {
    return apiClient(`/admin/emergency/${requestId}/fulfill`, {
      method: 'PUT',
      body: payload
    });
  },

  getCamps: async () => {
    return apiClient('/admin/camps');
  },

  createCamp: async (campData) => {
    return apiClient('/admin/camps', {
      method: 'POST',
      body: campData
    });
  }
};

export default adminApi;
