using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using Hypesoft.Application.Queries.Products;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, ApiResponseDto<PagedResultDto<ProductDto>>>
{
    private readonly IProductService _productService;

    public GetAllProductsQueryHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto<PagedResultDto<ProductDto>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        return await _productService.GetAllProductsAsync(request.Pagination, request.CategoryId, request.IncludeInactive);
    }
}

