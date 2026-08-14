namespace Enrollment.Application.EventHandlers;

using MediatR;
using Enrollment.Domain.Events;
using Contracts.IntegrationEvents.Academic;
using System.Threading;
using System.Threading.Tasks;

public sealed class CourseDroppedIntegrationEventPublisher : INotificationHandler<CourseDroppedDomainEvent>
{
    private readonly IPublisher _publisher;

    public CourseDroppedIntegrationEventPublisher(IPublisher publisher)
    {
        _publisher = publisher;
    }

    public async Task Handle(CourseDroppedDomainEvent notification, CancellationToken cancellationToken)
    {
        // Translate the internal domain event to a public integration event
        var integrationEvent = new CourseDroppedIntegrationEvent(
            notification.EventId,
            notification.OccurredOnUtc,
            notification.StudentId,
            notification.SectionId,
            notification.TermId
        );

        // Broadcast to the entire ERP system
        await _publisher.Publish(integrationEvent, cancellationToken);
    }
}
