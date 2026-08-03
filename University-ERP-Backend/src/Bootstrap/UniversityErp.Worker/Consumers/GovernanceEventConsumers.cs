namespace UniversityErp.Worker.Consumers;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Contracts.IntegrationEvents.Governance;
using Microsoft.Extensions.Logging;

/// <summary>
/// Handles Governance-related integration events received asynchronously by the background worker.
/// </summary>
public sealed class GrievanceSubmittedEventConsumer : INotificationHandler<GrievanceSubmittedIntegrationEvent>
{
    private readonly ILogger<GrievanceSubmittedEventConsumer> _logger;

    public GrievanceSubmittedEventConsumer(ILogger<GrievanceSubmittedEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Handle(GrievanceSubmittedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing GrievanceSubmittedIntegrationEvent for Grievance {GrievanceId}, Submitter {SubmitterId}, Category {Category}",
            notification.GrievanceId, notification.SubmitterId, notification.Category);

        return Task.CompletedTask;
    }
}

public sealed class SupportTicketRequestedEventConsumer : INotificationHandler<SupportTicketRequestedIntegrationEvent>
{
    private readonly ILogger<SupportTicketRequestedEventConsumer> _logger;

    public SupportTicketRequestedEventConsumer(ILogger<SupportTicketRequestedEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Handle(SupportTicketRequestedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing SupportTicketRequestedIntegrationEvent for Ticket {TicketId}, Requester {RequesterId}, Category {Category}",
            notification.TicketId, notification.RequesterId, notification.Category);

        return Task.CompletedTask;
    }
}

