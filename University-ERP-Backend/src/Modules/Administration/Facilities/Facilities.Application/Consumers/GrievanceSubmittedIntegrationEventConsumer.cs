namespace Facilities.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.Governance;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class GrievanceSubmittedIntegrationEventConsumer : INotificationHandler<GrievanceSubmittedIntegrationEvent>
{
    private readonly ILogger<GrievanceSubmittedIntegrationEventConsumer> _logger;

    public GrievanceSubmittedIntegrationEventConsumer(ILogger<GrievanceSubmittedIntegrationEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Handle(GrievanceSubmittedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        if (notification.Category.Equals("Facilities", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning(
                "🚨 Facilities Module intercepted critical grievance {GrievanceId}. Submitter: {SubmitterId}, Priority: {Priority}. Initiating emergency facility inspection workflow.",
                notification.GrievanceId,
                notification.SubmitterId,
                notification.Priority);
        }
        else
        {
            _logger.LogInformation(
                "Facilities Module received grievance {GrievanceId} with non-facility category {Category}. Skipping facility dispatch.",
                notification.GrievanceId,
                notification.Category);
        }

        return Task.CompletedTask;
    }
}

