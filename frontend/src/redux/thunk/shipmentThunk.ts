import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import type { IShipment, IRate, IPackage, IShipmentAddress } from '../../types';

interface CreateShipmentData {
  package: IPackage;
  senderAddress: IShipmentAddress;
  receiverAddress: IShipmentAddress;
}

export const createShipment = createAsyncThunk<
  IShipment,
  CreateShipmentData,
  { rejectValue: string }
>('shipment/createShipment', async (shipmentData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/shipment', shipmentData);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to create shipment';
    return rejectWithValue(message);
  }
});

export const getUserShipments = createAsyncThunk<
  IShipment[],
  void,
  { rejectValue: string }
>('shipment/getUserShipments', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/shipment');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch shipments';
    return rejectWithValue(message);
  }
});

export const getShipmentById = createAsyncThunk<
  IShipment,
  string,
  { rejectValue: string }
>('shipment/getShipmentById', async (shipmentId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/shipment/${shipmentId}`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch shipment';
    return rejectWithValue(message);
  }
});

export const compareRates = createAsyncThunk<
  IShipment,
  string,
  { rejectValue: string }
>('shipment/compareRates', async (shipmentId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/shipment/${shipmentId}/compare`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to compare rates';
    return rejectWithValue(message);
  }
});

export const selectRate = createAsyncThunk<
  IShipment,
  { shipmentId: string; shippoRateId: string },
  { rejectValue: string }
>('shipment/selectRate', async ({ shipmentId, shippoRateId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/shipment/${shipmentId}/select-rate`, {
      shippoRateId,
    });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to select rate';
    return rejectWithValue(message);
  }
});
