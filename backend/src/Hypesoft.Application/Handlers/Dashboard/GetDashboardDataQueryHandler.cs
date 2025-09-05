using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public class GetDashboardDataQueryHandler : IRequestHandler<GetDashboardDataQuery, ApiResponseDto<DashboardDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private static DashboardDto? _cachedData;
    private static DateTime _cacheExpiresAt = DateTime.MinValue;

    public GetDashboardDataQueryHandler(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ApiResponseDto<DashboardDto>> Handle(GetDashboardDataQuery request, CancellationToken cancellationToken)
    {
        if (DateTime.UtcNow < _cacheExpiresAt && _cachedData is not null)
        {
            return ApiResponseDto<DashboardDto>.SuccessResult(_cachedData);
        }

        try
        {
            var totalProducts = await _productRepository.GetTotalProductsCountAsync();
            var totalStockValue = await _productRepository.GetTotalStockValueAsync();
            var lowStockProducts = await _productRepository.GetLowStockProductsAsync(10);
            var allCategories = await _categoryRepository.GetActiveCategoriesAsync();

            var lowStockDtos = new List<LowStockProductDto>();
            foreach (var product in lowStockProducts)
            {
                var category = await _categoryRepository.GetByIdAsync(product.CategoryId);
                lowStockDtos.Add(new LowStockProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Sku = product.Sku,
                    StockQuantity = product.StockQuantity,
                    MinimumStock = product.MinimumStock,
                    CategoryName = category?.Name ?? "Unknown"
                });
            }

            var categoryStats = new List<CategoryStatsDto>();
            foreach (var category in allCategories)
            {
                var categoryProducts = await _productRepository.GetByCategoryIdAsync(category.Id);
                var productCount = categoryProducts.Count();
                var totalValue = categoryProducts.Sum(p => p.Price * p.StockQuantity);

                categoryStats.Add(new CategoryStatsDto
                {
                    CategoryId = category.Id,
                    CategoryName = category.Name,
                    ProductCount = productCount,
                    TotalValue = totalValue
                });
            }

            var dashboardData = new DashboardDto
            {
                TotalProducts = totalProducts,
                TotalStockValue = totalStockValue,
                LowStockProductsCount = lowStockProducts.Count(),
                LowStockProducts = lowStockDtos,
                CategoryStats = categoryStats
            };

            _cachedData = dashboardData;
            _cacheExpiresAt = DateTime.UtcNow.AddSeconds(60);
            return ApiResponseDto<DashboardDto>.SuccessResult(_cachedData);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<DashboardDto>.ErrorResult($"Error retrieving dashboard data: {ex.Message}");
        }
    }
}

