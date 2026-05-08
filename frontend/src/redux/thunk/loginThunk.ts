import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';


interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
  };
}


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

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterCredentials,
  { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<RegisterResponse>('/auth/register', {
      ...userData,
      role: 'user' 
    });
    return response.data;
  } catch (error: any) {
    console.error('Register Error:', error.response?.data);
    const message = error.response?.data?.message || 'Registration failed';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse, // This should represent the content of the "data" key
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<any>( 
      '/auth/login',
      { email, password },
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed';
    return rejectWithValue(message);
  }
});