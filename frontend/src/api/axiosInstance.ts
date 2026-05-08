// src/api/axiosInstance.ts
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import { setAccessToken, logout } from '../redux/slices/authSlice';

// Ensure this matches your backend's prefix (usually plural 'users')
const BASE_URL = 'http://localhost:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store?.getState()?.auth?.accessToken;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 1. Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // FIX: Added '/auth' prefix. Most refresh routes live in the Auth controller.
        // Check your backend: if it's just '/refresh-token', remove '/auth'
        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;

        // Update Redux
        store.dispatch(setAccessToken(newAccessToken));

        // Update Header for the retry
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (err) {
        // 2. If Refresh fails (404 or 401), force logout
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
