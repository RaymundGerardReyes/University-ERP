namespace HumanResources.Application.Abstractions;

using System.Threading;
using System.Threading.Tasks;
using HumanResources.Domain.Aggregates;

public interface IEmployeeRepository
{
    Task AddAsync(Employee employee, CancellationToken cancellationToken = default);
}
