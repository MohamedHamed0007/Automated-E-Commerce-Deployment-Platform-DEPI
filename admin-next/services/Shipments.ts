import axiosInstance from "@/lib/axiosInstance";
import { buildInternalApiUrl } from "@/lib/internalApiUrl";
import type { Shipment } from "@/types/Shipment";

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

const SHIPMENTS_COLLECTION_PATH = "/shipment/";
const SHIPMENTS_ITEM_PATH = "/shipment";

const unwrapResponse = <T>(payload: T | ApiResponse<T>): T => {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
};

export const getShipments = async (): Promise<Shipment[]> => {
  const response = await axiosInstance.get<ApiResponse<Shipment[]> | Shipment[]>(
    buildInternalApiUrl(SHIPMENTS_COLLECTION_PATH)
  );

  return unwrapResponse(response.data);
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  const response = await axiosInstance.get<ApiResponse<Shipment> | Shipment>(
    buildInternalApiUrl(`${SHIPMENTS_ITEM_PATH}/${id}`)
  );

  return unwrapResponse(response.data);
};
