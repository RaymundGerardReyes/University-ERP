namespace Enrollment.Application.EventHandlers;

using MediatR;
using Enrollment.Domain.Events; 
using Enrollment.Application.Features.Waitlist.PromoteWaitlist;
using System.Threading;
using System.Threading.Tasks;

public sealed class CourseDroppedDomainEventHandler : INotificationHandler<CourseDroppedDomainEvent>
{
    private readonly ISender _sender;

    public CourseDroppedDomainEventHandler(ISender sender)
    {
        _sender = sender;
    }

    public async Task Handle(CourseDroppedDomainEvent notification, CancellationToken cancellationToken)
    {
        // When a course is dropped, a seat opens up. We dynamically dispatch a command to fill it.
        var command = new PromoteWaitlistCommand(notification.SectionId, notification.TermId);
        
        await _sender.Send(command, cancellationToken);
    }
}
