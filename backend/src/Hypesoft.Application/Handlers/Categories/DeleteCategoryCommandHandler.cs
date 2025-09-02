using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, ApiResponseDto>
{
    private readonly ICategoryService _categoryService;

    public DeleteCategoryCommandHandler(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public async Task<ApiResponseDto> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        return await _categoryService.DeleteCategoryAsync(request.Id);
    }
}

