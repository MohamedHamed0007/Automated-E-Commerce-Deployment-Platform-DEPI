import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { setAccessToken } from "@/store/authSlice";
import { getAccessTokenCookie, removeAccessTokenCookie } from "@/lib/authCookies";


const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

// ── injectStore ────────────────────────────────────────────────────────────
let store: any;
export const injectStore = (_store: any) => {
  store = _store;
};

// ── Request interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store?.getState()?.auth?.accessToken ?? getAccessTokenCookie();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    //
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //
        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`, 
          {},
          { withCredentials: true }
        );
        const newToken = res.data?.data?.accessToken ?? res.data?.accessToken;

        if (!newToken) {
          throw new Error("Missing access token in refresh response.");
        }
        
        //
        store.dispatch(setAccessToken(newToken));
        
        //
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        //
        removeAccessTokenCookie();
        store.dispatch({ type: "auth/logout" });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
