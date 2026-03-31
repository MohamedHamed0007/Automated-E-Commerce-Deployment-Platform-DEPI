export interface Courier {
  _id?: string;
  id?: string;
  name: string;
  active: boolean;
  totalOrders: number;
  avgPrice: number;
  deliveryTime: string;
  rating: number;
}
