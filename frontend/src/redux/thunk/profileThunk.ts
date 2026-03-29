import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/auth/profile');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});


interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
}

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (formData: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      // The interceptor handles the Authorization header automatically
      const response = await axiosInstance.put('/user/profile', formData);
      
      // Assuming your successResponse utility returns { message, data: { user } }
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);