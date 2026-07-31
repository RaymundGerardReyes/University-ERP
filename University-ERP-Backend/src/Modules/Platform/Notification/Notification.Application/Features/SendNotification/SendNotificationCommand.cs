namespace Notification.Application.Features.SendNotification;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using Notification.Domain.Aggregates;
using Notification.Application.Abstractions;

public sealed record SendNotificationCommand(string RecipientId, string Channel, string ContentTemplate) : IRequest<Result<Guid>>;

public sealed class SendNotificationCommandHandler : IRequestHandler<SendNotificationCommand, Result<Guid>>
{
    private readonly INotificationRepository _repository;

    public SendNotificationCommandHandler(INotificationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
    {
        var notificationResult = NotificationMessage.Compose(
            request.RecipientId, 
            request.Channel, 
            request.ContentTemplate);

        if (notificationResult.IsFailure)
        {
            return Result<Guid>.Failure(notificationResult.Error);
        }

        await _repository.AddAsync(notificationResult.Value, cancellationToken);
        return Result<Guid>.Success(notificationResult.Value.Id);
    }
}
