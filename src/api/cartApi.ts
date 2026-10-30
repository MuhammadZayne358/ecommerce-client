import type { AddToCartRequest, Cart, UpdateCartItemRequest } from "../types/cart";
import api from "./axios";

export const getCart = async ()
:Promise<Cart> => {
    const response = await api.get<Cart>("/Cart");
    return response.data;
};

export const addToCart = async(
    data : AddToCartRequest
) : Promise<void> => {
    await api.post("/Cart/items", data);
};

export const updateCartItem = async(
    itemId : number,
    data : UpdateCartItemRequest
): Promise<void> => {
    await api.put(`/Cart/items/${itemId}`, data);
};

export const removeCartItem = async (
    itemId : number
) : Promise<void> => {
    await api.delete(`/Cart/items/${itemId}`);
}

