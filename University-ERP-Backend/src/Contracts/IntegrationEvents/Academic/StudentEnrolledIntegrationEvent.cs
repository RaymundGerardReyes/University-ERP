namespace Contracts.IntegrationEvents.Academic;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when a student is formally enrolled in a degree program.
/// Consumed asynchronously by Finance (to generate tuition invoices), Library, and Identity.
/// </summary>
public sealed record StudentEnrolledIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid StudentId,
    string ProgramCode,
    DateTime EnrollmentDate
) : IDomainEvent;
