namespace UniversityErp.Worker.Consumers;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Contracts.IntegrationEvents.Academic;
using Microsoft.Extensions.Logging;

/// <summary>
/// Handles Academic-related integration events received asynchronously by the background worker.
/// </summary>
public sealed class StudentEnrolledEventConsumer : INotificationHandler<StudentEnrolledIntegrationEvent>
{
    private readonly ILogger<StudentEnrolledEventConsumer> _logger;

    public StudentEnrolledEventConsumer(ILogger<StudentEnrolledEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Handle(StudentEnrolledIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing StudentEnrolledIntegrationEvent for Student {StudentId}, Program {ProgramCode}",
            notification.StudentId, notification.ProgramCode);

        // Additional worker logic: queue batch tuition invoice generation, initialize library profile, etc.

        return Task.CompletedTask;
    }
}
