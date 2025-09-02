using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all products with pagination
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10)</param>
    /// <param name="categoryId">Filter by category ID</param>
    /// <param name="includeInactive">Include inactive products</param>
    /// <returns>Paginated list of products</returns>
    [HttpGet]
    public async Task<ActionResult<ApiResponseDto<PagedResultDto<ProductDto>>>> GetAllProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? categoryId = null,
        [FromQuery] bool includeInactive = false)
    {
        var pagination = new PaginationDto
        {
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var query = new GetAllProductsQuery
        {
            Pagination = pagination,
            CategoryId = categoryId,
            IncludeInactive = includeInactive
        };

        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponseDto<ProductDto>>> GetProductById(string id)
    {
        var query = new GetProductByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return NotFound(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Get products with low stock
    /// </summary>
    /// <param name="minimumStock">Minimum stock threshold (default: 10)</param>
    /// <returns>List of low stock products</returns>
    [HttpGet("low-stock")]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<LowStockProductDto>>>> GetLowStockProducts(
        [FromQuery] int minimumStock = 10)
    {
        var query = new GetLowStockProductsQuery { MinimumStock = minimumStock };
        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    /// <param name="command">Product creation data</param>
    /// <returns>Created product</returns>
    [HttpPost]
    public async Task<ActionResult<ApiResponseDto<ProductDto>>> CreateProduct(CreateProductCommand command)
    {
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return CreatedAtAction(nameof(GetProductById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="command">Product update data</param>
    /// <returns>Updated product</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponseDto<ProductDto>>> UpdateProduct(string id, UpdateProductCommand command)
    {
        if (id != command.Id)
            return BadRequest(ApiResponseDto<ProductDto>.ErrorResult("ID mismatch"));
            
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Deletion result</returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDto>> DeleteProduct(string id)
    {
        var command = new DeleteProductCommand { Id = id };
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Update product stock
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="command">Stock update data</param>
    /// <returns>Updated product</returns>
    [HttpPut("{id}/stock")]
    public async Task<ActionResult<ApiResponseDto<ProductDto>>> UpdateStock(string id, UpdateStockCommand command)
    {
        if (id != command.ProductId)
            return BadRequest(ApiResponseDto<ProductDto>.ErrorResult("ID mismatch"));
            
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }
}

