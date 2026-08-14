namespace Finance.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.Academic;
using Finance.Application.Features.StudentBilling.AdjustTuition;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public sealed class CourseDroppedIntegrationEventConsumer : INotificationHandler<CourseDroppedIntegrationEvent>
{
    private readonly ISender _sender;
    private readonly ILogger<CourseDroppedIntegrationEventConsumer> _logger;

    public CourseDroppedIntegrationEventConsumer(ISender sender, ILogger<CourseDroppedIntegrationEventConsumer> logger)
    {
        _sender = sender;
        _logger = logger;
    }

    public async Task Handle(CourseDroppedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Finance Module intercepted dropped course for Student {StudentId}. Initiating tuition reassessment.", notification.StudentId);
        
        // Dispatch the command to apply a refund/credit to the student's ledger.
        // For demonstration, we apply a standard 400.00 USD credit for a dropped course.
        var command = new AdjustTuitionCommand(
            notification.StudentId, 
            -400.00m, 
            $"System Auto-Refund for dropping section {notification.SectionId}"
        );
        
        await _sender.Send(command, cancellationToken);
    }
}
