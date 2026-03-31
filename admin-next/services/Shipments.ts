import axiosInstance from "@/lib/axiosInstance";
import type { Shipment } from "@/types/Shipment";

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

// نصيحة: اتأكد إن الباك إند مستني المسار بـ / في الآخر أو لاء
// لو المسار في الباك إند هو /api/v1/shipment يبقى نكتبه كدة:
const SHIPMENTS_PATH = "/shipment"; 

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
  // 🔥 التعديل: استخدمنا axiosInstance مباشرة مع المسار
  const response = await axiosInstance.get<ApiResponse<Shipment[]> | Shipment[]>(
    SHIPMENTS_PATH
  );

  return unwrapResponse(response.data);
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  const response = await axiosInstance.get<ApiResponse<Shipment> | Shipment>(
    `${SHIPMENTS_PATH}/${id}`
  );

  return unwrapResponse(response.data);
};