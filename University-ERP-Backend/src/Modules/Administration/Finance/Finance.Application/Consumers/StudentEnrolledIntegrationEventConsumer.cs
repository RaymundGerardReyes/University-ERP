namespace Finance.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.StudentLifecycle;
using Finance.Application.Features.StudentBilling.AssessTuition;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

public sealed class StudentEnrolledIntegrationEventConsumer : INotificationHandler<StudentEnrolledIntegrationEvent>
{
    private readonly ISender _sender;
    private readonly ILogger<StudentEnrolledIntegrationEventConsumer> _logger;

    public StudentEnrolledIntegrationEventConsumer(ISender sender, ILogger<StudentEnrolledIntegrationEventConsumer> logger)
    {
        _sender = sender;
        _logger = logger;
    }

    public async Task Handle(StudentEnrolledIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Finance Module intercepted enrollment for Application {AppId}. Generating dynamic billing for Student {StudentId}", 
            notification.ApplicationId, notification.GeneratedStudentId);

        // Dispatch the command to dynamically assess the student's tuition
        var command = new AssessTuitionCommand(notification.GeneratedStudentId, "TERM-FALL-2026");
        
        await _sender.Send(command, cancellationToken);
    }
}
