# syntax=docker/dockerfile:1.6
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["src/Hypesoft.API/Hypesoft.API.csproj", "src/Hypesoft.API/"]
COPY ["src/Hypesoft.Application/Hypesoft.Application.csproj", "src/Hypesoft.Application/"]
COPY ["src/Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj", "src/Hypesoft.Infrastructure/"]
COPY ["src/Hypesoft.Domain/Hypesoft.Domain.csproj", "src/Hypesoft.Domain/"]

# Restore dependencies (cache NuGet)
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore "src/Hypesoft.API/Hypesoft.API.csproj"

# Copy all source code
COPY . .

# Build the application (use cache)
WORKDIR "/src/src/Hypesoft.API"
# Ensure full restore after sources are copied (some packages may be added in other projects)
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore "Hypesoft.API.csproj"
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet build "Hypesoft.API.csproj" -c Release -o /app/build --no-restore

FROM build AS publish
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish "Hypesoft.API.csproj" -c Release -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
