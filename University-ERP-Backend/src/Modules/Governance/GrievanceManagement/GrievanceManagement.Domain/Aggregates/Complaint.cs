namespace GrievanceManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Complaint : AggregateRoot<Guid>
{
    public string ComplainantId { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public string Priority { get; private set; } = "Normal";
    public string AssignedDepartment { get; private set; } = string.Empty;
    public string ResolutionNotes { get; private set; } = string.Empty;
    public DateTime SubmittedOnUtc { get; private set; }
    public DateTime? ResolvedOnUtc { get; private set; }

    private Complaint() { }

    private Complaint(Guid id, string complainantId, string category, string description) : base(id)
    {
        ComplainantId = complainantId;
        Category = category;
        Description = description;
        Status = "PendingReview";
        Priority = "Normal";
        SubmittedOnUtc = DateTime.UtcNow;
    }

    public static Result<Complaint> Submit(string complainantId, string category, string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return Result<Complaint>.Failure(new Error("Grievance.EmptyDescription", "Complaint description cannot be empty."));
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            return Result<Complaint>.Failure(new Error("Grievance.InvalidCategory", "Grievance category is required."));
        }

        return Result<Complaint>.Success(new Complaint(Guid.NewGuid(), complainantId, category, description));
    }

    public Result<bool> BeginInvestigation()
    {
        if (Status == "Resolved" || Status == "Dismissed")
        {
            return Result<bool>.Failure(new Error("Grievance.AlreadyClosed", $"Cannot investigate complaint that is already {Status}."));
        }

        Status = "UnderInvestigation";
        return Result<bool>.Success(true);
    }

    public Result<bool> Escalate(string targetDepartment, string priority, string escalationReason)
    {
        if (Status == "Resolved" || Status == "Dismissed")
        {
            return Result<bool>.Failure(new Error("Grievance.AlreadyResolved", $"Cannot escalate complaint that is already {Status}."));
        }

        if (string.IsNullOrWhiteSpace(targetDepartment))
        {
            return Result<bool>.Failure(new Error("Grievance.InvalidDepartment", "Target escalation department is required."));
        }

        Status = "Escalated";
        AssignedDepartment = targetDepartment;
        Priority = string.IsNullOrWhiteSpace(priority) ? "High" : priority;
        Description += $" | Escalation [{Priority} to {targetDepartment}]: {escalationReason}";

        return Result<bool>.Success(true);
    }

    public Result<bool> Resolve(string resolutionNotes)
    {
        if (Status == "Resolved")
        {
            return Result<bool>.Failure(new Error("Grievance.AlreadyResolved", "Complaint has already been resolved."));
        }

        if (string.IsNullOrWhiteSpace(resolutionNotes))
        {
            return Result<bool>.Failure(new Error("Grievance.EmptyResolution", "Resolution notes are required when closing a grievance."));
        }

        Status = "Resolved";
        ResolutionNotes = resolutionNotes;
        ResolvedOnUtc = DateTime.UtcNow;

        return Result<bool>.Success(true);
    }
}
