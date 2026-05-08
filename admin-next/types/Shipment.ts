export interface ShipmentEvent {
  _id?: string;
  id?: string;
  status: string;
  location: string;
  date?: string;
  time?: string;
  completed?: boolean;
  current?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShipmentCourier {
  _id?: string;
  id?: string;
  name: string;
  price?: number;
  deliveryTime?: string;
}

export interface Shipment {
  _id?: string;
  id?: string;
  trackingNumber?: string;
  from?: string;
  to?: string;
  status: string;
  progress?: number;
  currentLocation?: string;
  estimatedDelivery?: string;
  weight?: string | number;
  dimensions?: string;
  courier?: ShipmentCourier | string | null;
  events?: ShipmentEvent[];
  createdAt?: string;
  updatedAt?: string;
}
