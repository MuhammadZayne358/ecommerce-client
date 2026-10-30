export interface Category {
    id : number;
    name : string;
    description : string | null;
    isActive: boolean;
    createdAt : string;
    productCount : number;
}

export interface CreateCategoryData {
    name : string;
    description: string;
}

export interface UpdateCategoryData{
    name : string;
    description: string;
    isActive: boolean;
}