import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import {
  getAccessTokenCookie,
  removeAccessTokenCookie,
  setAccessTokenCookie,
} from "@/lib/authCookies";

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user:            Admin | null;
  accessToken:     string | null;
  loading:         boolean;
  error:           string | null;
  isAuthenticated: boolean;
  isHydrated:      boolean;
}

const initialState: AuthState = {
  user:            null,
  accessToken:     null,
  loading:         false,
  error:           null,
  isAuthenticated: false,
  isHydrated:      false,
};

export const loginUser = createAsyncThunk<
  { user: Admin; accessToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<any>("/auth/login", { email, password });
    return response.data.data as { user: Admin; accessToken: string };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "Login failed");
  }
});

export const getProfile = createAsyncThunk<Admin, void, { rejectValue: string }>(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      return response.data.data as Admin;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Failed to fetch profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isHydrated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      setAccessTokenCookie(action.payload);
      state.accessToken     = action.payload;
      state.isAuthenticated = true;
      state.isHydrated      = true;
    },
    logout: (state) => {
      removeAccessTokenCookie();
      state.user            = null;
      state.accessToken     = null;
      state.isAuthenticated = false;
      state.error           = null;
      state.isHydrated      = true;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        setAccessTokenCookie(action.payload.accessToken);
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isHydrated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isHydrated = true;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(getProfile.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isHydrated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        removeAccessTokenCookie();
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isHydrated = true;
        state.error = action.payload ?? "Session expired";
      });
  },
});

export const { hydrateAccessToken, setAccessToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
