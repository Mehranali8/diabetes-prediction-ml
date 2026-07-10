// Base API service setup to communicate with the backend prediction server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      let errMessage = 'API request failed';
      try {
        const errData = await response.json();
        errMessage = errData?.detail || errData?.message || errMessage;
      } catch (_) {}
      throw new Error(errMessage);
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errMessage = 'API request failed';
      try {
        const errData = await response.json();
        // If detailed validation array is returned by FastAPI, format first item
        if (Array.isArray(errData?.detail)) {
          errMessage = errData.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ');
        } else {
          errMessage = errData?.detail || errData?.message || errMessage;
        }
      } catch (_) {}
      throw new Error(errMessage);
    }
    return response.json();
  },
};
