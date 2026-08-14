namespace Admissions.Application.EventHandlers.DomainEventHandlers;

using MediatR;
using Admissions.Domain.Events;
using Contracts.IntegrationEvents.StudentLifecycle;
using System.Threading;
using System.Threading.Tasks;

public sealed class StudentEnrolledDomainEventHandler : INotificationHandler<StudentEnrolledDomainEvent>
{
    private readonly IPublisher _publisher;

    public StudentEnrolledDomainEventHandler(IPublisher publisher)
    {
        _publisher = publisher;
    }

    public async Task Handle(StudentEnrolledDomainEvent notification, CancellationToken cancellationToken)
    {
        // Translate the internal domain event to a cross-module integration event
        var integrationEvent = new StudentEnrolledIntegrationEvent(
            notification.EventId,
            notification.OccurredOnUtc,
            notification.ApplicationId,
            notification.GeneratedStudentId
        );

        await _publisher.Publish(integrationEvent, cancellationToken);
    }
}
