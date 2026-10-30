import type { CreateProductData, PagedResponse, Product, UpdateProductData } from "../types/product";
import api from "./axios";

export const getProducts = async (
    page = 1,
    pageSize = 12,
    search? : string,
    categoryId? : number,
    minPrice? : number,

    maxPrice? : number,

) : Promise<PagedResponse<Product>> => {
    const response = await api.get<PagedResponse<Product>>("/Products",{
        params : {
            page,
            pageSize,
            search : search || undefined,
            categoryId ,
            minPrice,
            maxPrice ,
        },
    });
    return response.data;
}

export const getAdminProducts = async (
    page = 1,
    pageSize = 12,
    search? : string,
    categoryId? : number,
    minPrice? : number,
    maxPrice? : number,

) : Promise<PagedResponse<Product>> => {
    const response = await api.get<PagedResponse<Product>>("/Products/admin",{
        params : {
            page,
            pageSize,
            search : search || undefined,
            categoryId ,
            minPrice,
            maxPrice ,
        },
    });
    return response.data;
}

export const getProductById = async (
    id : number
): Promise<Product> => {
    const response = await api.get<Product>(
        `/Products/${id}`
    );
    return response.data;
}

export const getAdminProductById = async (
    id : number
): Promise<Product> => {
    const response = await api.get<Product>(
        `/Products/admin/${id}`
    );
    return response.data;
}

export const deleteProduct = async (
    id : number
): Promise<void> => {
    await api.delete(`/Products/${id}`);
};

export const createdProduct = async (
    data : CreateProductData
): Promise<Product> => {

    const formData = new FormData();

    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("Price", data.price.toString());
    formData.append("StockQuantity", data.stockQuantity.toString());
    formData.append("CategoryId" , data.categoryId.toString());
    if(data.image){
        formData.append("Image", data.image);
    }
    const response = await api.post<Product>("/Products", formData);
    return response.data;
}

export const updateProduct = async (
    id: number,
     data : UpdateProductData,
) : Promise<void> => {
    const formData = new FormData();

    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("Price", data.price.toString());
    formData.append("StockQuantity", data.stockQuantity.toString());
    formData.append("CategoryId" , data.categoryId.toString());
    formData.append("IsActive", data.isActive.toString());
    if(data.image){
        formData.append("Image", data.image);
    }
    await api.put(`/Products/${id}`,
        formData
    )
    
}