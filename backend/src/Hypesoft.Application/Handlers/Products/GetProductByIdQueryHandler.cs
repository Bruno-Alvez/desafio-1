using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using Hypesoft.Application.Queries.Products;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ApiResponseDto<ProductDto>>
{
    private readonly IProductService _productService;

    public GetProductByIdQueryHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        return await _productService.GetProductByIdAsync(request.Id);
    }
}

