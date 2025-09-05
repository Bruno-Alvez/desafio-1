using Hypesoft.Application;
using Hypesoft.Infrastructure.Configurations;
using Hypesoft.API.Extensions;
using Serilog;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using HealthChecks.MongoDb;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/hypesoft-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Hypesoft Product Management API", 
        Version = "v1",
        Description = "API for managing products, categories, and inventory in the Hypesoft system"
    });
    
    // Include XML comments
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Add Application services
builder.Services.AddApplication();

// Add Infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Add Authentication
builder.Services.AddKeycloakAuthentication(builder.Configuration);

// HealthChecks
var mongoConnection = builder.Configuration.GetConnectionString("MongoDB");
builder.Services
    .AddHealthChecks()
    .AddMongoDb(mongoConnection, name: "mongodb", timeout: TimeSpan.FromSeconds(3));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    options.AddPolicy("ProdCors", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

// Rate Limiting (global, por IP)
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var key = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
            AutoReplenishment = true
        });
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS deve vir o mais cedo possível, antes de auth
app.UseCors(app.Environment.IsDevelopment() ? "DevCors" : "ProdCors");

// Redirecionamento HTTPS somente em Produção (evita problemas em Dev quando rodando apenas HTTP)
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
    app.UseHsts();
    app.Use(async (context, next) =>
    {
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
        context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        context.Response.Headers["X-XSS-Protection"] = "0";
        await next();
    });
}

app.UseAuthentication();
app.UseRateLimiter();
app.UseAuthorization();
app.MapControllers();

// Health check endpoints
app.MapHealthChecks("/health/live");
app.MapHealthChecks("/health/ready");

try
{
    Log.Information("Starting Hypesoft API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
