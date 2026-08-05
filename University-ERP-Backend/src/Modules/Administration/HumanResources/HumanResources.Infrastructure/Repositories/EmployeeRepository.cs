namespace HumanResources.Infrastructure.Repositories;

using System.Threading;
using System.Threading.Tasks;
using HumanResources.Application.Abstractions;
using HumanResources.Domain.Aggregates;
using HumanResources.Infrastructure.Persistence;

// Note: Ensure IEmployeeRepository exists in HumanResources.Application.Abstractions
public sealed class EmployeeRepository : IEmployeeRepository
{
    private readonly HumanResourcesDbContext _dbContext;

    public EmployeeRepository(HumanResourcesDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        await _dbContext.Employees.AddAsync(employee, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}