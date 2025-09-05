import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categoriesService';
import { CreateCategoryDto, UpdateCategoryDto } from '@/types/api';
import { toast } from 'sonner';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (includeInactive: boolean) => [...categoryKeys.lists(), { includeInactive }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Get all categories
export const useCategories = (includeInactive: boolean = false) => {
  return useQuery({
    queryKey: categoryKeys.list(includeInactive),
    queryFn: () => categoriesService.getAll(includeInactive),
    select: (response) => response.data || [],
  });
};

// Get category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        toast.success('Categoria criada com sucesso');
      } else {
        toast.error(response.message || 'Falha ao criar categoria');
      }
    },
    onError: (error: unknown) => {
      console.error('Create category error:', error);
      const apiMessage = (error as any)?.response?.data?.message;
      toast.error(apiMessage || 'Falha ao criar categoria');
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesService.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        toast.success('Categoria atualizada com sucesso');
      } else {
        toast.error(response.message || 'Falha ao atualizar categoria');
      }
    },
    onError: (error: unknown) => {
      console.error('Update category error:', error);
      const apiMessage = (error as any)?.response?.data?.message;
      toast.error(apiMessage || 'Falha ao atualizar categoria');
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        toast.success('Categoria excluída com sucesso');
      } else {
        toast.error(response.message || 'Falha ao excluir categoria');
      }
    },
    onError: (error: unknown) => {
      console.error('Delete category error:', error);
      const apiMessage = (error as any)?.response?.data?.message;
      toast.error(apiMessage || 'Falha ao excluir categoria');
    },
  });
};
