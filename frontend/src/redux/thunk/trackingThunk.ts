import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import type { ITrackingResult } from '../../types';

export const getTracking = createAsyncThunk<
  ITrackingResult,
  string,
  { rejectValue: string }
>('tracking/getTracking', async (shipmentId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/shipment/${shipmentId}/track`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch tracking';
    return rejectWithValue(message);
  }
});
