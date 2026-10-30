import type { AdminDashboard } from "../types/admin";
import api from "./axios";

export const getAdminDashboard =
async () : Promise<AdminDashboard> => {
    const response = await api.get<AdminDashboard>(
        "/admin/dashboard"
    );
    return response.data;
}