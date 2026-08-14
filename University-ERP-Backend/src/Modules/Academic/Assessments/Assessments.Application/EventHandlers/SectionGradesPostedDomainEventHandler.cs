namespace Assessments.Application.EventHandlers;

using MediatR;
using Assessments.Domain.Events;
using Contracts.IntegrationEvents.Academic;
using System.Threading;
using System.Threading.Tasks;

public sealed class SectionGradesPostedDomainEventHandler : INotificationHandler<SectionGradesPostedDomainEvent>
{
    private readonly IPublisher _publisher;

    public SectionGradesPostedDomainEventHandler(IPublisher publisher)
    {
        _publisher = publisher;
    }

    public async Task Handle(SectionGradesPostedDomainEvent notification, CancellationToken cancellationToken)
    {
        var integrationEvent = new GradesPostedIntegrationEvent(
            notification.EventId,
            notification.OccurredOnUtc,
            notification.SectionId,
            notification.StudentFinalGrades
        );

        await _publisher.Publish(integrationEvent, cancellationToken);
    }
}
