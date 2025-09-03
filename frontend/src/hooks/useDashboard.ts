import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
};

// Get dashboard data
export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: () => dashboardService.getData(),
    select: (response) => response.data,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
