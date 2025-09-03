// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors: string[];
  timestamp: string;
}

// Pagination Types
export interface PaginationDto {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// Product Types
export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  stockQuantity: number;
  minimumStock: number;
  isActive: boolean;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  minimumStock: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: ProductDimensions;
}

export interface UpdateProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  minimumStock: number;
  isActive: boolean;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: ProductDimensions;
}

export interface UpdateStockDto {
  productId: string;
  quantity: number;
  reason: string;
}

// Dashboard Types
export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  minimumStock: number;
  categoryName: string;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalValue: number;
}

export interface DashboardData {
  totalProducts: number;
  totalStockValue: number;
  lowStockProductsCount: number;
  lowStockProducts: LowStockProduct[];
  categoryStats: CategoryStats[];
}
