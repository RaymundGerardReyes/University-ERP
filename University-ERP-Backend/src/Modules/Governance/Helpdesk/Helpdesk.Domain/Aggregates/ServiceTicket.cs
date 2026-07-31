namespace Helpdesk.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class ServiceTicket : AggregateRoot<Guid>
{
    public string RequesterId { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string IssueDescription { get; private set; } = string.Empty;
    public string Priority { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime CreatedOnUtc { get; private set; }

    private ServiceTicket() { }

    private ServiceTicket(Guid id, string requesterId, string category, string issueDescription, string priority) : base(id)
    {
        RequesterId = requesterId;
        Category = category;
        IssueDescription = issueDescription;
        Priority = priority;
        Status = "Open";
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Result<ServiceTicket> Create(string requesterId, string category, string issueDescription, string priority)
    {
        if (string.IsNullOrWhiteSpace(issueDescription))
        {
            return Result<ServiceTicket>.Failure(new Error("Helpdesk.EmptyDescription", "Issue description is required."));
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            return Result<ServiceTicket>.Failure(new Error("Helpdesk.InvalidCategory", "Service category is required."));
        }

        return Result<ServiceTicket>.Success(new ServiceTicket(Guid.NewGuid(), requesterId, category, issueDescription, priority));
    }
}
