using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var user = new
        {
            Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Username = User.FindFirst(ClaimTypes.Name)?.Value,
            Email = User.FindFirst(ClaimTypes.Email)?.Value,
            Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList(),
            Claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
        };

        return Ok(new
        {
            Success = true,
            Data = user,
            Message = "User information retrieved successfully",
            Errors = new List<string>(),
            Timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("check")]
    public IActionResult CheckAuth()
    {
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
        
        return Ok(new
        {
            Success = true,
            Data = new { IsAuthenticated = isAuthenticated },
            Message = isAuthenticated ? "User is authenticated" : "User is not authenticated",
            Errors = new List<string>(),
            Timestamp = DateTime.UtcNow
        });
    }
}
