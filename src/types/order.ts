export interface CheckoutRequest {
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  paymentMethod: "COD" | "Card";
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;

  subTotal: number;
  shippingFee: number;
  totalAmount: number;

  userName: string;
  userEmail: string;

  status: string;
  paymentStatus: string;
  paymentMethod: string;

  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;

  createdAt: string;

  items: OrderItem[];
}
