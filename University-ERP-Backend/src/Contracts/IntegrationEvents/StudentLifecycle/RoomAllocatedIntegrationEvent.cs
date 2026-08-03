namespace Contracts.IntegrationEvents.StudentLifecycle;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when a student is allocated a hostel room.
/// Consumed by Finance (to add hostel fees to the invoice) and Facilities.
/// </summary>
public sealed record RoomAllocatedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid StudentId,
    string HostelName,
    string RoomNumber,
    decimal MonthlyFee
) : IDomainEvent;
