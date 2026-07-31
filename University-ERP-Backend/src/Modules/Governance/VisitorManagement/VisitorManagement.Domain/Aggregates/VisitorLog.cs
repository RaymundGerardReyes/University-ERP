namespace VisitorManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class VisitorLog : AggregateRoot<Guid>
{
    public string VisitorName { get; private set; } = string.Empty;
    public string Purpose { get; private set; } = string.Empty;
    public string HostId { get; private set; } = string.Empty;
    public DateTime EntryTimeUtc { get; private set; }
    public DateTime? ExitTimeUtc { get; private set; }
    public string Status { get; private set; } = string.Empty;

    private VisitorLog() { }

    private VisitorLog(Guid id, string visitorName, string purpose, string hostId) : base(id)
    {
        VisitorName = visitorName;
        Purpose = purpose;
        HostId = hostId;
        EntryTimeUtc = DateTime.UtcNow;
        Status = "CheckedIn";
    }

    public static Result<VisitorLog> Register(string visitorName, string purpose, string hostId)
    {
        if (string.IsNullOrWhiteSpace(visitorName))
        {
            return Result<VisitorLog>.Failure(new Error("Visitor.InvalidName", "Visitor name is required."));
        }

        return Result<VisitorLog>.Success(new VisitorLog(Guid.NewGuid(), visitorName, purpose, hostId));
    }
}
