import { api } from '@/lib/api';
import { 
  Category, 
  CreateCategoryDto, 
  UpdateCategoryDto, 
  ApiResponse 
} from '@/types/api';

export const categoriesService = {
  // Get all categories
  getAll: async (includeInactive: boolean = false): Promise<ApiResponse<Category[]>> => {
    return api.get<Category[]>(`/categories?includeInactive=${includeInactive}`);
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    return api.get<Category>(`/categories/${id}`);
  },

  // Create new category
  create: async (data: CreateCategoryDto): Promise<ApiResponse<Category>> => {
    return api.post<Category>('/categories', data);
  },

  // Update category
  update: async (id: string, data: UpdateCategoryDto): Promise<ApiResponse<Category>> => {
    return api.put<Category>(`/categories/${id}`, { ...data, id });
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/categories/${id}`);
  },
};
