FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore src/Bootstrap/UniversityErp.Api/UniversityErp.Api.csproj
RUN dotnet publish src/Bootstrap/UniversityErp.Api/UniversityErp.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgssapi-krb5-2 curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .

# Run as non-root user
USER app

EXPOSE 5191

# Implement Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -sf http://localhost:5191/health/ready || exit 1

ENTRYPOINT ["dotnet", "UniversityErp.Api.dll"]
