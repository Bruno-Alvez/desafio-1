import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/productsService';
import { CreateProductDto, UpdateProductDto, UpdateStockDto, PaginationDto } from '@/types/api';
import { toast } from 'sonner';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (pagination: PaginationDto, categoryId?: string, includeInactive?: boolean) => 
    [...productKeys.lists(), { pagination, categoryId, includeInactive }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  lowStock: (minimumStock: number) => [...productKeys.all, 'lowStock', { minimumStock }] as const,
};

// Get all products with pagination
export const useProducts = (
  pagination: PaginationDto,
  categoryId?: string,
  includeInactive: boolean = false
) => {
  return useQuery({
    queryKey: productKeys.list(pagination, categoryId, includeInactive),
    queryFn: () => productsService.getAll(pagination, categoryId, includeInactive),
    select: (response) => response.data,
  });
};

// Get product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Get low stock products
export const useLowStockProducts = (minimumStock: number = 10) => {
  return useQuery({
    queryKey: productKeys.lowStock(minimumStock),
    queryFn: () => productsService.getLowStock(minimumStock),
    select: (response) => response.data || [],
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsService.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        queryClient.invalidateQueries({ queryKey: productKeys.lowStock(10) });
        toast.success('Product created successfully!');
      } else {
        toast.error(response.message || 'Failed to create product');
      }
    },
    onError: (error: any) => {
      console.error('Create product error:', error);
      toast.error('Failed to create product');
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsService.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: productKeys.lowStock(10) });
        toast.success('Product updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update product');
      }
    },
    onError: (error: any) => {
      console.error('Update product error:', error);
      toast.error('Failed to update product');
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        queryClient.invalidateQueries({ queryKey: productKeys.lowStock(10) });
        toast.success('Product deleted successfully!');
      } else {
        toast.error(response.message || 'Failed to delete product');
      }
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      toast.error('Failed to delete product');
    },
  });
};

// Update stock mutation
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStockDto }) =>
      productsService.updateStock(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: productKeys.lowStock(10) });
        toast.success('Stock updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update stock');
      }
    },
    onError: (error: any) => {
      console.error('Update stock error:', error);
      toast.error('Failed to update stock');
    },
  });
};
