namespace Finance.Tests.Integration;

using Finance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit;
using System.Threading.Tasks;

public abstract class IntegrationTestBase : IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:15-alpine")
        .WithDatabase("finance_test_db")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    protected FinanceDbContext DbContext { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        
        var options = new DbContextOptionsBuilder<FinanceDbContext>()
            .UseNpgsql(_dbContainer.GetConnectionString())
            .Options;

        DbContext = new FinanceDbContext(options);
        await DbContext.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await DbContext.DisposeAsync();
        await _dbContainer.DisposeAsync();
    }
}
