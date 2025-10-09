import { OrderItem } from "./orderItem.model";

export interface ShoppingCart {
  id?: string;
  accountId: string;
  items: OrderItem[];
}
