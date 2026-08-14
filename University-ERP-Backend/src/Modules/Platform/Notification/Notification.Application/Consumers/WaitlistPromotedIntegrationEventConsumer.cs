namespace Notification.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.Academic;
using Notification.Application.Features.SendNotification;
using System.Threading;
using System.Threading.Tasks;

public sealed class WaitlistPromotedIntegrationEventConsumer : INotificationHandler<WaitlistPromotedIntegrationEvent>
{
    private readonly ISender _sender;

    public WaitlistPromotedIntegrationEventConsumer(ISender sender)
    {
        _sender = sender;
    }

    public async Task Handle(WaitlistPromotedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        // Construct the personalized alert message
        var message = $"Great news! A seat opened up and you have been successfully promoted from the waitlist into {notification.CourseCode}. Your active schedule has been updated.";

        // Dispatch the existing notification command within the Platform module
        var command = new SendNotificationCommand(
            notification.StudentId,
            "Email", // Channels could be Email, SMS, or InApp
            message
        );

        await _sender.Send(command, cancellationToken);
    }
}
