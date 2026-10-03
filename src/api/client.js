import { handleMockRequest } from '../mockBackend/mockApi';

const REMOTE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || null;

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('eraktkosh_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  // If a remote backend URL is explicitly configured in .env (e.g. VITE_API_BASE_URL),
  // attempt to reach it first with fallback to client-side mock backend.
  if (REMOTE_API_BASE_URL) {
    let url = `${REMOTE_API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (remoteErr) {
      console.warn(`Remote API unreachable (${remoteErr.message}), seamlessly serving from in-browser standalone backend.`);
    }
  }

  // Default: In-browser standalone backend with full persistence and live simulation
  try {
    return await handleMockRequest(endpoint, config);
  } catch (err) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
};

export default apiClient;
