using AutoMapper;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, ApiResponseDto<CategoryDto>>
{
    private readonly ICategoryService _categoryService;

    public UpdateCategoryCommandHandler(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public async Task<ApiResponseDto<CategoryDto>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var updateDto = new UpdateCategoryDto
        {
            Id = request.Id,
            Name = request.Name,
            Description = request.Description,
            IsActive = request.IsActive
        };

        return await _categoryService.UpdateCategoryAsync(updateDto);
    }
}

