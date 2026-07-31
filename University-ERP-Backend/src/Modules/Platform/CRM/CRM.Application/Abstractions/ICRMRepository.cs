namespace CRM.Application.Abstractions;

using CRM.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface ICRMRepository
{
    Task AddAsync(Prospect prospect, CancellationToken cancellationToken);
}
