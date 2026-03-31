import axios from "axios";

import axiosInstance from "@/lib/axiosInstance";
import type { Shipment } from "@/types/Shipment";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: {
    message?: string;
    code?: string;
  };
}

type UnknownRecord = Record<string, unknown>;

const SHIPMENTS_PATH = "/admin/shipments";
const STATUS_ENDPOINT_SUFFIX = "/status";
const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i;
const TRACKING_ID_PATTERN = /^[A-Z0-9_-]{6,}$/i;

const STATUS_LABELS: Record<string, Shipment["status"]> = {
  draft: "Pending",
  pending: "Pending",
  compared: "Processing",
  processing: "Processing",
  booked: "In Transit",
  "in transit": "In Transit",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  delivered: "Delivered",
};

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object";
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asFiniteNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function unwrapResponse<T>(payload: T | ApiResponse<T>): T {
  if (payload !== null && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
    return payload.data as T;
  }

  return payload as T;
}

function formatRoute(address: unknown) {
  if (!isRecord(address)) {
    return undefined;
  }

  const city = asString(address.city);
  const state = asString(address.state);
  const country = asString(address.country);

  return [city, state, country].filter(Boolean).join(", ") || undefined;
}

function normalizeStatus(value: unknown): Shipment["status"] {
  const raw = asString(value, "Pending");
  return STATUS_LABELS[raw.trim().toLowerCase()] ?? "Pending";
}

function inferProgress(status: Shipment["status"]) {
  switch (status) {
    case "Pending":
      return 15;
    case "Processing":
      return 45;
    case "In Transit":
      return 75;
    case "Delivered":
      return 100;
    case "Cancelled":
      return 0;
    default:
      return 0;
  }
}

function normalizeCourier(payload: UnknownRecord): Shipment["courier"] {
  const selectedRate = isRecord(payload.selectedRate) ? payload.selectedRate : null;
  const rawCourier = isRecord(payload.courier) ? payload.courier : null;
  const candidate = selectedRate ?? rawCourier;

  if (!candidate) {
    return null;
  }

  const price =
    asFiniteNumber(candidate.finalRate) ??
    asFiniteNumber(candidate.price) ??
    asFiniteNumber(candidate.rate);
  const deliveryDays =
    asFiniteNumber(candidate.deliveryDays) ?? asFiniteNumber(candidate.estimatedDays);

  return {
    _id: asOptionalString(candidate._id),
    id: asOptionalString(candidate.id),
    name:
      asString(candidate.carrier) ||
      asString(candidate.name) ||
      asString(candidate.service) ||
      "Unknown courier",
    price,
    deliveryTime: deliveryDays !== undefined ? `${deliveryDays} days` : undefined,
  };
}

function normalizeEvents(payload: UnknownRecord, status: Shipment["status"]): Shipment["events"] {
  const rawEvents = Array.isArray(payload.events) ? payload.events.filter(isRecord) : [];

  if (rawEvents.length > 0) {
    return rawEvents.map((event, index) => ({
      _id: asOptionalString(event._id),
      id: asOptionalString(event.id),
      status: asString(event.status, status),
      location: asString(event.location, asString(event.city, "Unknown location")),
      date: asOptionalString(event.date) ?? asOptionalString(event.createdAt),
      time: asOptionalString(event.time),
      completed: typeof event.completed === "boolean" ? event.completed : true,
      current: typeof event.current === "boolean" ? event.current : index === rawEvents.length - 1,
      createdAt: asOptionalString(event.createdAt),
      updatedAt: asOptionalString(event.updatedAt),
    }));
  }

  return [
    {
      _id: asOptionalString(payload._id),
      status,
      location: formatRoute(payload.receiverAddress) ?? "Unknown location",
      date: asOptionalString(payload.updatedAt) ?? asOptionalString(payload.createdAt),
      completed: status !== "Pending",
      current: true,
      createdAt: asOptionalString(payload.createdAt),
      updatedAt: asOptionalString(payload.updatedAt),
    },
  ];
}

function normalizeShipment(payload: unknown): Shipment {
  const record = isRecord(payload) ? payload : {};
  const packageInfo = isRecord(record.package) ? record.package : null;
  const status = normalizeStatus(record.status ?? record.state);
  const trackingNumber =
    asOptionalString(record.trackingNumber) ??
    asOptionalString(record.trackingId) ??
    asOptionalString(record.awb);

  const length = packageInfo ? asFiniteNumber(packageInfo.length) : undefined;
  const width = packageInfo ? asFiniteNumber(packageInfo.width) : undefined;
  const height = packageInfo ? asFiniteNumber(packageInfo.height) : undefined;
  const units = packageInfo ? asString(packageInfo.units) : "";
  const weight = packageInfo ? asFiniteNumber(packageInfo.weight) : undefined;

  const dimensions =
    length !== undefined && width !== undefined && height !== undefined
      ? `${length} x ${width} x ${height} ${units}`.trim()
      : asOptionalString(record.dimensions);

  return {
    _id: asOptionalString(record._id) ?? asOptionalString(record.id),
    id: asOptionalString(record.id) ?? asOptionalString(record._id),
    trackingNumber,
    from: formatRoute(record.senderAddress) ?? asOptionalString(record.from),
    to: formatRoute(record.receiverAddress) ?? asOptionalString(record.to),
    status,
    progress: asFiniteNumber(record.progress) ?? inferProgress(status),
    currentLocation:
      asOptionalString(record.currentLocation) ??
      formatRoute(record.receiverAddress) ??
      formatRoute(record.senderAddress),
    estimatedDelivery:
      asOptionalString(record.estimatedDelivery) ??
      asOptionalString(record.deliveryDate) ??
      asOptionalString(record.paidOn),
    weight:
      weight !== undefined ? `${weight} ${units}`.trim() : (record.weight as Shipment["weight"]),
    dimensions,
    courier: normalizeCourier(record),
    events: normalizeEvents(record, status),
    createdAt: asOptionalString(record.createdAt),
    updatedAt: asOptionalString(record.updatedAt),
  };
}

function normalizeShipmentList(payload: unknown): Shipment[] {
  const unwrapped = unwrapResponse(payload as unknown[] | ApiResponse<unknown[]>);
  return Array.isArray(unwrapped) ? unwrapped.map(normalizeShipment) : [];
}

function normalizeShipmentItem(payload: unknown): Shipment {
  return normalizeShipment(unwrapResponse(payload as UnknownRecord | ApiResponse<UnknownRecord>));
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiResponse<unknown> | undefined;
    const apiMessage =
      responseData?.message ??
      responseData?.error?.message ??
      error.message ??
      fallbackMessage;

    if (error.response?.status === 404) {
      return "Shipment not found.";
    }

    if (error.response?.status === 400) {
      return apiMessage || "Invalid Tracking ID.";
    }

    return apiMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

function ensureShipmentLookup(idOrTracking: string) {
  const value = idOrTracking.trim();

  if (!value) {
    throw new Error("Invalid Tracking ID.");
  }

  return value;
}

function validateShipmentLookup(idOrTracking: string) {
  if (!MONGO_ID_PATTERN.test(idOrTracking) && !TRACKING_ID_PATTERN.test(idOrTracking)) {
    throw new Error("Invalid Tracking ID.");
  }
}

function toBackendShipmentStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case "pending":
      return "pending";
    case "processing":
      return "processing";
    case "in transit":
      return "in transit";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "draft":
    case "compared":
    case "booked":
      return normalized;
    default:
      throw new Error(
        "Invalid shipment status. Use Pending, Processing, In Transit, or Cancelled."
      );
  }
}

export async function getShipments(): Promise<Shipment[]> {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown[]> | unknown[]>(SHIPMENTS_PATH);
    return normalizeShipmentList(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch shipments."));
  }
}

export async function getShipmentById(idOrTracking: string): Promise<Shipment> {
  const shipmentLookup = ensureShipmentLookup(idOrTracking);
  validateShipmentLookup(shipmentLookup);

  try {
    const response = await axiosInstance.get<ApiResponse<unknown> | unknown>(
      `${SHIPMENTS_PATH}/${shipmentLookup}`
    );
    return normalizeShipmentItem(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch shipment."));
  }
}

export async function updateShipmentStatus(
  idOrTracking: string,
  status: string
): Promise<Shipment> {
  const shipmentLookup = ensureShipmentLookup(idOrTracking);
  validateShipmentLookup(shipmentLookup);

  try {
    const response = await axiosInstance.patch<ApiResponse<unknown> | unknown>(
      `${SHIPMENTS_PATH}/${shipmentLookup}${STATUS_ENDPOINT_SUFFIX}`,
      { status: toBackendShipmentStatus(status) }
    );

    return normalizeShipmentItem(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update shipment status."));
  }
}

export async function deleteShipment(id: string): Promise<string> {
  const shipmentId = ensureShipmentLookup(id);

  try {
    await axiosInstance.delete(`${SHIPMENTS_PATH}/${shipmentId}`);
    return shipmentId;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to delete shipment."));
  }
}
