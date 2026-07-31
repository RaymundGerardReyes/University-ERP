namespace Notification.Application.Abstractions;

using Notification.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface INotificationRepository
{
    Task AddAsync(NotificationMessage notification, CancellationToken cancellationToken);
}
