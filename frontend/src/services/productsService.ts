import { api } from '@/lib/api';
import { 
  Product, 
  CreateProductDto, 
  UpdateProductDto, 
  UpdateStockDto,
  LowStockProduct,
  PagedResult,
  PaginationDto,
  ApiResponse 
} from '@/types/api';

export const productsService = {
  // Get all products with pagination
  getAll: async (
    pagination: PaginationDto,
    categoryId?: string,
    includeInactive: boolean = false
  ): Promise<ApiResponse<PagedResult<Product>>> => {
    const params = new URLSearchParams({
      pageNumber: pagination.pageNumber.toString(),
      pageSize: pagination.pageSize.toString(),
      includeInactive: includeInactive.toString(),
    });

    if (categoryId) {
      params.append('categoryId', categoryId);
    }

    if (pagination.searchTerm) {
      params.append('searchTerm', pagination.searchTerm);
    }

    if (pagination.sortBy) {
      params.append('sortBy', pagination.sortBy);
      params.append('sortDescending', pagination.sortDescending?.toString() || 'false');
    }

    return api.get<PagedResult<Product>>(`/products?${params.toString()}`);
  },

  // Get product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return api.get<Product>(`/products/${id}`);
  },

  // Create new product
  create: async (data: CreateProductDto): Promise<ApiResponse<Product>> => {
    return api.post<Product>('/products', data);
  },

  // Update product
  update: async (id: string, data: UpdateProductDto): Promise<ApiResponse<Product>> => {
    return api.put<Product>(`/products/${id}`, { ...data, id });
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/products/${id}`);
  },

  // Update product stock
  updateStock: async (id: string, data: UpdateStockDto): Promise<ApiResponse<Product>> => {
    return api.put<Product>(`/products/${id}/stock`, { ...data, productId: id });
  },

  // Get low stock products
  getLowStock: async (minimumStock: number = 10): Promise<ApiResponse<LowStockProduct[]>> => {
    return api.get<LowStockProduct[]>(`/products/low-stock?minimumStock=${minimumStock}`);
  },
};
