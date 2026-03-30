import { createSlice } from '@reduxjs/toolkit';
import { createPaymentIntent, confirmPayment } from '../thunk/paymentThunk';

interface PaymentState {
  clientSecret: string | null;
  paymentId: string | null;
  paymentIntentId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  clientSecret: null,
  paymentId: null,
  paymentIntentId: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.clientSecret = null;
      state.paymentId = null;
      state.paymentIntentId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.paymentId = action.payload.paymentId;
        state.paymentIntentId = action.payload.paymenyIntentId;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
