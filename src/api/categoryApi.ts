import type { Category, CreateCategoryData, UpdateCategoryData } from "../types/category";
import api from "./axios";

export const getCategories = async () : Promise<Category[]> =>{
    const response = await api.get<Category[]>(
        "/Categories"
    );
    return response.data;
};
export const getAdminCategories = async () : Promise<Category[]> =>{
    const response = await api.get<Category[]>(
        "/Categories/admin"
    );
    return response.data;
};
export const getCategoryById = async (
    id: number
): Promise<Category> => {
    const response = await api.get<Category>(
        `/Categories/${id}`
    );

    return response.data;
};

export const createCategory = async (
    data: CreateCategoryData
): Promise<Category> => {
    const response = await api.post<Category>(
        "/Categories",
        data
    );

    return response.data;
};

export const updateCategory = async (
    id: number,
    date : UpdateCategoryData
) : Promise<void> => {
    await api.put(
        `/Categories/${id}`,
        date
    );
};


export const deleteCategory = async (
    id:number
): Promise<void> => {
    await api.delete(
        `/Categories/${id}`
    );
};