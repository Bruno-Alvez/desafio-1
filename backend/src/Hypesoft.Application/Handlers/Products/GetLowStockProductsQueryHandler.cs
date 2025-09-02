using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using Hypesoft.Application.Queries.Products;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class GetLowStockProductsQueryHandler : IRequestHandler<GetLowStockProductsQuery, ApiResponseDto<IEnumerable<LowStockProductDto>>>
{
    private readonly IProductService _productService;

    public GetLowStockProductsQueryHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto<IEnumerable<LowStockProductDto>>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        return await _productService.GetLowStockProductsAsync(request.MinimumStock);
    }
}

