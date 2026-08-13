FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore src/Bootstrap/UniversityErp.Migrator/UniversityErp.Migrator.csproj
RUN dotnet publish src/Bootstrap/UniversityErp.Migrator/UniversityErp.Migrator.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .

# Run as non-root user
USER app

ENTRYPOINT ["sh", "-c", "echo '🔄 Starting Database Migrations...' && dotnet UniversityErp.Migrator.dll && echo '✅ Migrations complete! Container exiting successfully.'"]
