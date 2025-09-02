using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ApiResponseDto<ProductDto>>
{
    private readonly IProductService _productService;

    public UpdateProductCommandHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var updateDto = new UpdateProductDto
        {
            Id = request.Id,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            StockQuantity = request.StockQuantity,
            MinimumStock = request.MinimumStock,
            IsActive = request.IsActive,
            Sku = request.Sku,
            Barcode = request.Barcode,
            Weight = request.Weight,
            Dimensions = request.Dimensions
        };

        return await _productService.UpdateProductAsync(updateDto);
    }
}

