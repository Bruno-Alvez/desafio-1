using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, ApiResponseDto>
{
    private readonly IProductService _productService;

    public DeleteProductCommandHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ApiResponseDto> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        return await _productService.DeleteProductAsync(request.Id);
    }
}

