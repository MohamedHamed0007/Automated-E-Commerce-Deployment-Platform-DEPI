import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { getShipmentById, getShipments } from "@/services/Shipments";
import type { Shipment } from "@/types/Shipment";

interface ShipmentsState {
  shipments: Shipment[];
  currentShipment: Shipment | null;
  loadingShipments: boolean;
  loadingCurrentShipment: boolean;
  error: string | null;
}

const initialState: ShipmentsState = {
  shipments: [],
  currentShipment: null,
  loadingShipments: false,
  loadingCurrentShipment: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const fetchShipments = createAsyncThunk<
  Shipment[],
  void,
  { rejectValue: string }
>("shipments/fetchShipments", async (_, { rejectWithValue }) => {
  try {
    return await getShipments();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch shipments"));
  }
});

export const fetchShipmentById = createAsyncThunk<
  Shipment,
  string,
  { rejectValue: string }
>("shipments/fetchShipmentById", async (id, { rejectWithValue }) => {
  try {
    return await getShipmentById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch shipment"));
  }
});

const shipmentsSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
    clearShipmentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loadingShipments = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loadingShipments = false;
        state.error = null;
        state.shipments = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loadingShipments = false;
        state.error = action.payload ?? "Failed to fetch shipments";
      })
      .addCase(fetchShipmentById.pending, (state) => {
        state.loadingCurrentShipment = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loadingCurrentShipment = false;
        state.error = null;
        state.currentShipment = action.payload;

        const existingShipmentIndex = state.shipments.findIndex(
          (shipment) => getShipmentKey(shipment) === getShipmentKey(action.payload)
        );

        if (existingShipmentIndex >= 0) {
          state.shipments[existingShipmentIndex] = action.payload;
        } else {
          state.shipments.push(action.payload);
        }
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loadingCurrentShipment = false;
        state.error = action.payload ?? "Failed to fetch shipment";
      });
  },
});

const getShipmentKey = (shipment: Shipment) =>
  shipment._id || shipment.id || shipment.trackingNumber || "";

export const { clearCurrentShipment, clearShipmentsError } =
  shipmentsSlice.actions;
export default shipmentsSlice.reducer;
