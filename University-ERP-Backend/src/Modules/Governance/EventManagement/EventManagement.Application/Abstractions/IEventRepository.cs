namespace EventManagement.Application.Abstractions;

using EventManagement.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IEventRepository
{
    Task AddAsync(CampusEvent campusEvent, CancellationToken cancellationToken);
}
