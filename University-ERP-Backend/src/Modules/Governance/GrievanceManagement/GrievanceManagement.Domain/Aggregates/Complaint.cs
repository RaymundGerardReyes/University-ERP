namespace GrievanceManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Complaint : AggregateRoot<Guid>
{
    public string ComplainantId { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime SubmittedOnUtc { get; private set; }

    private Complaint() { }

    private Complaint(Guid id, string complainantId, string category, string description) : base(id)
    {
        ComplainantId = complainantId;
        Category = category;
        Description = description;
        Status = "PendingReview";
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
}
