import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = 'https://api.yourdomain.com';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ======================
   REQUEST INTERCEPTOR
====================== */
axiosInstance.interceptors.request.use(
  async config => {
    const token = await storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/* ======================
   RESPONSE INTERCEPTOR
====================== */
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If 401 & not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storage.getRefreshToken();

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        await storage.setTokens({
          accessToken,
          refreshToken: newRefreshToken,
        });

        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await storage.clear();

        // 👉 Trigger logout / navigate to login
        // e.g. navigationRef.reset(...)
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
