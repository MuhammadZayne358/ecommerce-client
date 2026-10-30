export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  categoryIsActive: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface PagedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  image?: File | null;
}
export interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  isActive: boolean;
  image?: File | null;
}
