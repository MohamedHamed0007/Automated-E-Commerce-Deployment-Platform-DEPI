import { createSlice } from '@reduxjs/toolkit';
import type { ITrackingResult } from '../../types';
import { getTracking } from '../thunk/trackingThunk';

interface TrackingState {
  tracking: ITrackingResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrackingState = {
  tracking: null,
  loading: false,
  error: null,
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    clearTracking: (state) => {
      state.tracking = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.tracking = action.payload;
      })
      .addCase(getTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTracking } = trackingSlice.actions;
export default trackingSlice.reducer;
