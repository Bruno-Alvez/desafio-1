import { api } from '@/lib/api';
import { DashboardData, ApiResponse } from '@/types/api';

export const dashboardService = {
  // Get dashboard data
  getData: async (): Promise<ApiResponse<DashboardData>> => {
    return api.get<DashboardData>('/dashboard');
  },
};
