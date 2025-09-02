using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ApiResponseDto<ProductDto>>
{
    private readonly IProductService _productService;

    public CreateProductCommandHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var createDto = new CreateProductDto
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            StockQuantity = request.StockQuantity,
            MinimumStock = request.MinimumStock,
            Sku = request.Sku,
            Barcode = request.Barcode,
            Weight = request.Weight,
            Dimensions = request.Dimensions
        };

        return await _productService.CreateProductAsync(createDto);
    }
}

