"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useLowStockProducts, useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export default function Home() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Visão geral");

  // Fetch data from API
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard();
  const { data: lowStockData, isLoading: lowStockLoading } = useLowStockProducts();
  const { data: allProductsData } = useProducts({ pageNumber: 1, pageSize: 500, searchTerm: "", sortBy: "name", sortDescending: false });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const tabs = ["Visão geral"];

  const metrics = [
    {
      title: "Total de produtos",
      value: `${dashboardData?.totalProducts || 0} produtos`,
      change: "+12% em relação ao mês passado",
      changeType: "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-package"
        >
          <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" x2="12" y1="22.08" y2="12"></line>
        </svg>
      ),
    },
    {
      title: "Valor total do estoque",
      value: `R$ ${dashboardData?.totalStockValue || 0}`,
      change: "+8% em relação ao mês passado",
      changeType: "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-dollar-sign"
        >
          <line x1="12" x2="12" y1="2" y2="22"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
    },
    {
      title: "Estoque baixo",
      value: `${dashboardData?.lowStockProductsCount || 0} produtos`,
      change: "Necessita reposição",
      changeType: (dashboardData?.lowStockProductsCount || 0) > 0 ? "negative" : "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-alert-triangle"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
      ),
    },
  ];

  const chartLowStock = (categoriesData || []).map((c: any) => ({
    name: c.name,
    value: (lowStockData || []).filter((p: any) => p.categoryName === c.name).length,
  }));

  const chartTotal = (categoriesData || []).map((c: any) => ({
    name: c.name,
    value: (allProductsData?.items || []).filter((p: any) => p.categoryId === c.id).length,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Não autenticado</h1>
          <p>Faça login para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta, {user?.firstName || 'Usuário'}!</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                {metric.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </span>
                {(metric as any).chart && <div className="flex-1">{(metric as any).chart}</div>}
              </div>
              <p
                className={`text-sm ${
                  metric.changeType === "positive"
                    ? "text-green-600"
                    : metric.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produtos por categoria (total)</h2>
          <div className="w-full overflow-x-auto">
            <div className="flex items-end gap-4 h-40">
              {chartTotal.map((item) => (
                <div key={item.name} className="flex flex-col items-center min-w-[60px]">
                  <div
                    className="w-8 bg-purple-500 rounded"
                    style={{ height: `${Math.min(100, (item.value || 0) * 20)}%` }}
                    title={`${item.name}: ${item.value}`}
                  />
                  <span className="mt-2 text-xs text-gray-600 truncate max-w-[80px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              ))}
              {chartTotal.length === 0 && (
                <div className="text-sm text-gray-500">Sem dados para exibir</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produtos com estoque baixo por categoria</h2>
          <div className="w-full overflow-x-auto">
            <div className="flex items-end gap-4 h-40">
              {chartLowStock.map((item) => (
                <div key={item.name} className="flex flex-col items-center min-w-[60px]">
                  <div
                    className="w-8 bg-red-500 rounded"
                    style={{ height: `${Math.min(100, (item.value || 0) * 20)}%` }}
                    title={`${item.name}: ${item.value}`}
                  />
                  <span className="mt-2 text-xs text-gray-600 truncate max-w-[80px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              ))}
              {chartLowStock.length === 0 && (
                <div className="text-sm text-gray-500">Sem dados para exibir</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Atividades recentes</h2>
        </div>
        <div className="p-6">
          {dashboardLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockData?.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Estoque baixo: {product.stockQuantity} unidades</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{product.categoryName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}