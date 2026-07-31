namespace QualityAccreditation.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class AccreditationEvidence : AggregateRoot<Guid>
{
    public string StandardCode { get; private set; } = string.Empty;
    public string SubmitterId { get; private set; } = string.Empty;
    public string DocumentReference { get; private set; } = string.Empty;
    public string ComplianceStatus { get; private set; } = string.Empty;
    public DateTime SubmittedOnUtc { get; private set; }

    private AccreditationEvidence() { }

    private AccreditationEvidence(Guid id, string standardCode, string submitterId, string documentReference) : base(id)
    {
        StandardCode = standardCode;
        SubmitterId = submitterId;
        DocumentReference = documentReference;
        ComplianceStatus = "UnderReview";
        SubmittedOnUtc = DateTime.UtcNow;
    }

    public static Result<AccreditationEvidence> Submit(string standardCode, string submitterId, string documentReference)
    {
        if (string.IsNullOrWhiteSpace(standardCode))
        {
            return Result<AccreditationEvidence>.Failure(new Error("Accreditation.InvalidStandard", "Standard code is required."));
        }

        if (string.IsNullOrWhiteSpace(documentReference))
        {
            return Result<AccreditationEvidence>.Failure(new Error("Accreditation.InvalidEvidence", "Document reference is required."));
        }

        return Result<AccreditationEvidence>.Success(new AccreditationEvidence(Guid.NewGuid(), standardCode, submitterId, documentReference));
    }
}
