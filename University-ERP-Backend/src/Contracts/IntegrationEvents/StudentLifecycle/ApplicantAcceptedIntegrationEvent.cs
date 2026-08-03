namespace Contracts.IntegrationEvents.StudentLifecycle;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when an applicant is formally accepted into the university.
/// Consumed by Academic (to initialize records) and Finance (for deposit collection).
/// </summary>
public sealed record ApplicantAcceptedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid ApplicantId,
    string TargetProgramCode,
    string AcademicYear
) : IDomainEvent;
