import { createSlice } from '@reduxjs/toolkit';
import type { IShipment, IRate } from '../../types';
import {
  createShipment,
  getUserShipments,
  getShipmentById,
  compareRates,
  selectRate,
  deleteShipment // Added the new deleteShipment thunk
} from '../thunk/shipmentThunk';

interface ShipmentState {
  shipments: IShipment[];
  currentShipment: IShipment | null;
  rates: IRate[];
  loading: boolean;
  error: string | null;
}

const initialState: ShipmentState = {
  shipments: [],
  currentShipment: null,
  rates: [],
  loading: false,
  error: null
};

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
    clearRates: (state) => {
      state.rates = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(getUserShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
        if (action.payload.comparisonResults) {
          state.rates = action.payload.comparisonResults;
        }
      })
      .addCase(getShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(compareRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compareRates.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
        state.rates = action.payload.comparisonResults || [];
      })
      .addCase(compareRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(selectRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectRate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(selectRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // --- New Delete Shipment Cases ---
      .addCase(deleteShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.loading = false;
        // Automatically remove the deleted shipment from the state array
        state.shipments = state.shipments.filter((shipment) => shipment._id !== action.payload);

        // Optional: If the currently viewed shipment was just deleted, clear it out
        if (state.currentShipment?._id === action.payload) {
          state.currentShipment = null;
          state.rates = [];
        }
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentShipment, clearRates } = shipmentSlice.actions;
export default shipmentSlice.reducer;
