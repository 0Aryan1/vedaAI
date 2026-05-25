import axios, { AxiosError, AxiosInstance } from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vedaai-backend.onrender.com/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? (error.response.data as { message: string }).message
        : error.message;
    return Promise.reject(new Error(message || 'API Error'));
  }
);

export default apiClient;
