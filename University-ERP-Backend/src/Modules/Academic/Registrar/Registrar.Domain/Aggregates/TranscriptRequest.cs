namespace Registrar.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class TranscriptRequest : AggregateRoot<Guid>
{
    public Guid StudentId { get; private set; }
    public string RequestStatus { get; private set; } = string.Empty;
    public string Purpose { get; private set; } = string.Empty;
    public DateTime RequestedOnUtc { get; private set; }

    private TranscriptRequest() { }

    private TranscriptRequest(Guid id, Guid studentId, string purpose) : base(id)
    {
        StudentId = studentId;
        Purpose = purpose;
        RequestStatus = "Pending_Clearance";
        RequestedOnUtc = DateTime.UtcNow;
    }

    public static Result<TranscriptRequest> Create(Guid studentId, string purpose)
    {
        if (string.IsNullOrWhiteSpace(purpose)) return Result<TranscriptRequest>.Failure(new Error("Registrar.InvalidPurpose", "Purpose of request is required."));
        
        return Result<TranscriptRequest>.Success(new TranscriptRequest(Guid.NewGuid(), studentId, purpose));
    }
}