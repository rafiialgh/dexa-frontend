import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

export const API = {
  url: `${API_URL}/api`,
};

const defaultOptions = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const globalInstance = axios.create({
  baseURL: API.url,
  ...defaultOptions,
});

export const privateInstance = axios.create({
  baseURL: API.url,
  ...defaultOptions,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const attachTokenInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;

      if (status === 429) {
        toast.error('Too many requests, please try again later.');
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.log('Refresh token failed, redirecting to login');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (status === 401 && !originalRequest._retry) {
        console.log('Got 401, attempting token refresh for:', originalRequest.url);

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => resolve(instance(originalRequest)),
              reject: (err) => reject(err),
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log('sini')
          await globalInstance.post('/auth/refresh-token');
          console.log('Token refreshed successfully');

          processQueue(null);

          return instance(originalRequest);

        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError);

          processQueue(refreshError);

          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

attachTokenInterceptors(privateInstance);