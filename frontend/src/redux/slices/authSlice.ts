import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../thunk/loginThunk';
import { getProfile, updateProfile } from '../thunk/profileThunk';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: true, 
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.loading = false; 
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false; 
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- Login --- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user as User;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = (action.payload as string) || 'Login failed';
      })

      /* --- Get Profile (The Refresh Trigger) --- */
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        // state.user = null;
        // state.accessToken = null;
        // state.isAuthenticated = false;
        // state.error = (action.payload as string) || 'Session expired';
      })

      /* --- Update Profile --- */
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          ...action.payload.user
        } as User;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Update failed';
      });
  }
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
