namespace VisitorManagement.Application.Abstractions;

using VisitorManagement.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IVisitorRepository
{
    Task AddAsync(VisitorLog visitorLog, CancellationToken cancellationToken);
}
