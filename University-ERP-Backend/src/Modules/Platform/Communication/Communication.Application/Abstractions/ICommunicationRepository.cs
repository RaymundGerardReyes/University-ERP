namespace Communication.Application.Abstractions;

using Communication.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface ICommunicationRepository
{
    Task AddAsync(DirectMessage message, CancellationToken cancellationToken);
}
