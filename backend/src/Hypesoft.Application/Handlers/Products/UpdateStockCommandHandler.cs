using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class UpdateStockCommandHandler : IRequestHandler<UpdateStockCommand, ApiResponseDto<ProductDto>>
{
    private readonly IProductService _productService;

    public UpdateStockCommandHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto<ProductDto>> Handle(UpdateStockCommand request, CancellationToken cancellationToken)
    {
        var updateStockDto = new UpdateStockDto
        {
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            Reason = request.Reason
        };

        return await _productService.UpdateStockAsync(updateStockDto);
    }
}

