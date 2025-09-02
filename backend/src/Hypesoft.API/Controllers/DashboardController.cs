using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get dashboard data including metrics and statistics
    /// </summary>
    /// <returns>Dashboard data with totals, low stock products, and category statistics</returns>
    [HttpGet]
    public async Task<ActionResult<ApiResponseDto<DashboardDto>>> GetDashboardData()
    {
        var query = new GetDashboardDataQuery();
        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }
}

