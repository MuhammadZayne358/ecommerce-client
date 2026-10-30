import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import api from "./axios";

export const login = async (
    data : LoginRequest
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/Auth/login",
        data
    );
    return response.data;
};

export const register = async (
    data : RegisterRequest
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/Auth/register",
        data
    );
    return response.data;
}

export const getCurrentUser = async(): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/Auth/me");

    return response.data;
}