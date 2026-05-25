import axios, { AxiosError, AxiosInstance } from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vedaai-backend.onrender.com/api';

interface RetryableConfig {
  _retry?: boolean;
  [key: string]: unknown;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor with retry logic for network errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isNetworkError = !error.response
    const config = error.config as RetryableConfig | undefined
    const isFirstAttempt = !config?._retry
    
    if (isNetworkError && isFirstAttempt && config) {
      config._retry = true
      await new Promise(r => setTimeout(r, 3000))
      return apiClient.request(config as Parameters<typeof apiClient.request>[0])
    }
    
    const message =
      error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? (error.response.data as { message: string }).message
        : error.message;
    return Promise.reject(new Error(message || 'API Error'));
  }
);

export default apiClient;
