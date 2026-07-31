namespace Helpdesk.Application.Abstractions;

using Helpdesk.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IHelpdeskRepository
{
    Task AddAsync(ServiceTicket ticket, CancellationToken cancellationToken);
}
