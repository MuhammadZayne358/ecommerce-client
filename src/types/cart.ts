export interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    stockQuantity: number;
}

export interface Cart {
    cartId: number;
    items: CartItem[];
    shippingFee: number;
    totalItems: number;
    subTotal: number;
}

 export interface AddToCartRequest {
    productId : number;
    quantity : number;
 } 
 export interface UpdateCartItemRequest {
    quantity : number;
 }