import type { Order, CheckoutRequest } from "../types/order";
import type { PagedResponse } from "../types/product";
import api from "./axios";

export const checkout = async (
    data: CheckoutRequest 
) : Promise<Order> => {
    const response = await api.post<Order>(
        "/Orders/checkout",
        data
    );
    return response.data
}

export const getMyOrders = async (

) : Promise<Order[]> => {
    const respose = await api.get<Order[]>(
        "/Orders"
    );
    return respose.data;
};

export const cancelOrder = async (
    id : number
) : Promise<void> => {
    await api.post(`/orders/${id}/cancel`);
};

export const getMyOrderById = async (
    id: number
): Promise<Order> => {
    const response = await api.get<Order>(
        `/Orders/${id}`
    );
    return response.data;
};

// export interface UpdateOrderStatusData {
//     status : string;
// }

export const getAdminOrders = async (
    page = 1,
    pageSize = 10,
    status? :string

): Promise<PagedResponse<Order>> => {
    const response = await api.get<PagedResponse<Order>>(
        "/admin/orders",
        {
            params: { page, pageSize, status},
        }
    );
    return response.data;
};

export const getAdminOrderById = async (
    id : number
): Promise<Order> => {
    const  response = await api.get<Order>(
        `/admin/orders/${id}`
    )
    return response.data;
}
// export const UpdateOrderStatus = async(
//     id: number,
//     data : UpdateOrderStatusData
// ) : Promise<void> => {
//     await api.put(
//         `admin/orders/${id}/status`,
//         data
//     );
// };

export const UpdateOrderStatus = async(
    id: number,
    status : string,
) : Promise<void> => {
    await api.put(
        `admin/orders/${id}/status`,
        {status}
        
    );
};

export const markOrderAsPaid = async(
    id: number
): Promise<void> => {
    await api.put(`/admin/orders/${id}/payment-status`, {
        paymentStatus: "Paid",
    });
};