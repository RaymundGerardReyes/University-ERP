namespace Enrollment.Application.EventHandlers;

using MediatR;
using Enrollment.Domain.Events;
using Contracts.IntegrationEvents.Academic;
using System.Threading;
using System.Threading.Tasks;

public sealed class WaitlistPromotedDomainEventHandler : INotificationHandler<WaitlistPromotedDomainEvent>
{
    private readonly IPublisher _publisher;

    public WaitlistPromotedDomainEventHandler(IPublisher publisher)
    {
        _publisher = publisher;
    }

    public async Task Handle(WaitlistPromotedDomainEvent notification, CancellationToken cancellationToken)
    {
        var integrationEvent = new WaitlistPromotedIntegrationEvent(
            notification.EventId,
            notification.OccurredOnUtc,
            notification.StudentId,
            notification.CourseCode
        );

        await _publisher.Publish(integrationEvent, cancellationToken);
    }
}
