using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all categories
    /// </summary>
    /// <param name="includeInactive">Include inactive categories</param>
    /// <returns>List of categories</returns>
    [HttpGet]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<CategoryDto>>>> GetAllCategories(
        [FromQuery] bool includeInactive = false)
    {
        var query = new GetAllCategoriesQuery { IncludeInactive = includeInactive };
        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Get category by ID
    /// </summary>
    /// <param name="id">Category ID</param>
    /// <returns>Category details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponseDto<CategoryDto>>> GetCategoryById(string id)
    {
        var query = new GetCategoryByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return NotFound(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Create a new category
    /// </summary>
    /// <param name="command">Category creation data</param>
    /// <returns>Created category</returns>
    [HttpPost]
    public async Task<ActionResult<ApiResponseDto<CategoryDto>>> CreateCategory(CreateCategoryCommand command)
    {
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return CreatedAtAction(nameof(GetCategoryById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Update an existing category
    /// </summary>
    /// <param name="id">Category ID</param>
    /// <param name="command">Category update data</param>
    /// <returns>Updated category</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponseDto<CategoryDto>>> UpdateCategory(string id, UpdateCategoryCommand command)
    {
        if (id != command.Id)
            return BadRequest(ApiResponseDto<CategoryDto>.ErrorResult("ID mismatch"));
            
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Delete a category
    /// </summary>
    /// <param name="id">Category ID</param>
    /// <returns>Deletion result</returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> DeleteCategory(string id)
    {
        var command = new DeleteCategoryCommand { Id = id };
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }
}

