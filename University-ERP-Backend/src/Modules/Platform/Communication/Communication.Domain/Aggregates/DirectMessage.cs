namespace Communication.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class DirectMessage : AggregateRoot<Guid>
{
    public string SenderId { get; private set; } = string.Empty;
    public string ReceiverId { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public DateTime SentOnUtc { get; private set; }
    public bool IsRead { get; private set; }

    private DirectMessage() { }

    private DirectMessage(Guid id, string senderId, string receiverId, string content) : base(id)
    {
        SenderId = senderId;
        ReceiverId = receiverId;
        Content = content;
        SentOnUtc = DateTime.UtcNow;
        IsRead = false;
    }

    public static Result<DirectMessage> Send(string senderId, string receiverId, string content)
    {
        if (string.IsNullOrWhiteSpace(senderId))
            return Result<DirectMessage>.Failure(new Error("Communication.InvalidSender", "Sender ID is required."));
            
        if (string.IsNullOrWhiteSpace(receiverId))
            return Result<DirectMessage>.Failure(new Error("Communication.InvalidReceiver", "Receiver ID is required."));
            
        if (string.IsNullOrWhiteSpace(content))
            return Result<DirectMessage>.Failure(new Error("Communication.EmptyContent", "Message content cannot be empty."));

        return Result<DirectMessage>.Success(new DirectMessage(Guid.NewGuid(), senderId, receiverId, content));
    }

    public void MarkAsRead()
    {
        IsRead = true;
    }
}
