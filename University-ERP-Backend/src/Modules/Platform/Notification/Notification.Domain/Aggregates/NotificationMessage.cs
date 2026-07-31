namespace Notification.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class NotificationMessage : AggregateRoot<Guid>
{
    public string RecipientId { get; private set; } = string.Empty;
    public string Channel { get; private set; } = string.Empty;
    public string ContentTemplate { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime CreatedOnUtc { get; private set; }

    private NotificationMessage() { }

    private NotificationMessage(Guid id, string recipientId, string channel, string contentTemplate) : base(id)
    {
        RecipientId = recipientId;
        Channel = channel;
        ContentTemplate = contentTemplate;
        Status = "Pending";
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Result<NotificationMessage> Compose(string recipientId, string channel, string contentTemplate)
    {
        if (string.IsNullOrWhiteSpace(recipientId))
            return Result<NotificationMessage>.Failure(new Error("Notification.InvalidRecipient", "Recipient ID is required."));
            
        if (string.IsNullOrWhiteSpace(contentTemplate))
            return Result<NotificationMessage>.Failure(new Error("Notification.InvalidContent", "Content template cannot be empty."));

        return Result<NotificationMessage>.Success(new NotificationMessage(Guid.NewGuid(), recipientId, channel, contentTemplate));
    }

    public void MarkAsSent()
    {
        Status = "Sent";
    }
}
