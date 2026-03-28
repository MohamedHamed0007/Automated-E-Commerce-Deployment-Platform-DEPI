import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    _id: string; 
    fullName: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse, // This should represent the content of the "data" key
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<any>( // Use any temporarily to avoid type errors during fix
      '/auth/login',
      { email, password },
      { withCredentials: true }
    );

    // IMPORTANT: Return response.data.data because the backend
    // wraps the user and token inside a "data" property
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed';
    return rejectWithValue(message);
  }
});