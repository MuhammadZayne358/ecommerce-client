import type { Address, SaveAddressRequest } from "../types/address";
import api from "./axios";

export const getMyAddress = async(): Promise<Address[]> => {
    const response = await api.get<Address[]>("/Addresses")
    return response.data;
}

export const createAddress = async (
    data: SaveAddressRequest
): Promise<Address> => {
    const response = await api.post<Address>("/Addresses", data);
    return response.data;
};

export const setDefaultAddress = async (id: number) : Promise<void> => {
    await api.post(`/Addresses/${id}default`);
};

export const deletAddress = async (id: number) : Promise<void> => {
    await api.delete(`/Addresses/${id}`);
}