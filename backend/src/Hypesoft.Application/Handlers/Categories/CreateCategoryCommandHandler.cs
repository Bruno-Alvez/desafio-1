using AutoMapper;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Interfaces;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, ApiResponseDto<CategoryDto>>
{
    private readonly ICategoryService _categoryService;

    public CreateCategoryCommandHandler(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public async Task<ApiResponseDto<CategoryDto>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var createDto = new CreateCategoryDto
        {
            Name = request.Name,
            Description = request.Description
        };

        return await _categoryService.CreateCategoryAsync(createDto);
    }
}

