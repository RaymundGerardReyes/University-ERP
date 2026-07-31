namespace MultiCampus.Application.Abstractions;

using MultiCampus.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface ICampusRepository
{
    Task AddAsync(Campus campus, CancellationToken cancellationToken);
}
