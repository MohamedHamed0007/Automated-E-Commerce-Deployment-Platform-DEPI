import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import type { CreatePaymentResponse } from '../../types';

export const createPaymentIntent = createAsyncThunk<
  CreatePaymentResponse,
  string,
  { rejectValue: string }
>('payment/createPaymentIntent', async (shipmentId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/payments', { shipmentId });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to create payment';
    return rejectWithValue(message);
  }
});

export const confirmPayment = createAsyncThunk<
  { success: boolean },
  { paymentIntentId: string; returnUrl: string },
  { rejectValue: string }
>('payment/confirmPayment', async ({ paymentIntentId, returnUrl }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/payments/confirm', { paymentIntentId, returnUrl });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to confirm payment';
    return rejectWithValue(message);
  }
});
