import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  deleteShipment as deleteShipmentRequest,
  getShipmentById,
  getShipments,
  updateShipmentStatus as updateShipmentStatusRequest,
} from "@/services/Shipments";
import type { Shipment } from "@/types/Shipment";

interface ShipmentsState {
  shipments: Shipment[];
  currentShipment: Shipment | null;
  loadingShipments: boolean;
  loadingCurrentShipment: boolean;
  updatingStatus: boolean;
  deletingShipmentId: string | null;
  error: string | null;
}

const initialState: ShipmentsState = {
  shipments: [],
  currentShipment: null,
  loadingShipments: false,
  loadingCurrentShipment: false,
  updatingStatus: false,
  deletingShipmentId: null,
  error: null,
};

export const fetchShipments = createAsyncThunk<
  Shipment[],
  void,
  { rejectValue: string }
>("shipments/fetchShipments", async (_, { rejectWithValue }) => {
  try {
    return await getShipments();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch shipments."
    );
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
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch shipment."
    );
  }
});

export const patchShipmentStatus = createAsyncThunk<
  Shipment,
  { idOrTracking: string; status: string },
  { rejectValue: string }
>("shipments/patchShipmentStatus", async ({ idOrTracking, status }, { rejectWithValue }) => {
  try {
    return await updateShipmentStatusRequest(idOrTracking, status);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update shipment status."
    );
  }
});

export const deleteShipment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("shipments/deleteShipment", async (id, { rejectWithValue }) => {
  try {
    return await deleteShipmentRequest(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete shipment."
    );
  }
});

const getShipmentKey = (shipment: Shipment) =>
  shipment._id || shipment.id || shipment.trackingNumber || "";

const upsertShipment = (shipments: Shipment[], nextShipment: Shipment) => {
  const shipmentKey = getShipmentKey(nextShipment);
  const existingShipmentIndex = shipments.findIndex(
    (shipment) => getShipmentKey(shipment) === shipmentKey
  );

  if (existingShipmentIndex >= 0) {
    shipments[existingShipmentIndex] = nextShipment;
  } else {
    shipments.unshift(nextShipment);
  }
};

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
        state.error = action.payload ?? "Failed to fetch shipments.";
      })
      .addCase(fetchShipmentById.pending, (state) => {
        state.loadingCurrentShipment = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loadingCurrentShipment = false;
        state.error = null;
        state.currentShipment = action.payload;
        upsertShipment(state.shipments, action.payload);
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loadingCurrentShipment = false;
        state.currentShipment = null;
        state.error = action.payload ?? "Failed to fetch shipment.";
      })
      .addCase(patchShipmentStatus.pending, (state) => {
        state.updatingStatus = true;
        state.error = null;
      })
      .addCase(patchShipmentStatus.fulfilled, (state, action) => {
        state.updatingStatus = false;
        state.error = null;
        state.currentShipment = action.payload;
        upsertShipment(state.shipments, action.payload);
      })
      .addCase(patchShipmentStatus.rejected, (state, action) => {
        state.updatingStatus = false;
        state.error = action.payload ?? "Failed to update shipment status.";
      })
      .addCase(deleteShipment.pending, (state, action) => {
        state.deletingShipmentId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.deletingShipmentId = null;
        state.error = null;
        state.shipments = state.shipments.filter(
          (shipment) => getShipmentKey(shipment) !== action.payload
        );

        if (state.currentShipment && getShipmentKey(state.currentShipment) === action.payload) {
          state.currentShipment = null;
        }
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.deletingShipmentId = null;
        state.error = action.payload ?? "Failed to delete shipment.";
      });
  },
});

export const { clearCurrentShipment, clearShipmentsError } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
