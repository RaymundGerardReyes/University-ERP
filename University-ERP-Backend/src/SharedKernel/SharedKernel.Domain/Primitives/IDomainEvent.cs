namespace SharedKernel.Domain.Primitives;

/// <summary>
/// Marker interface for all Domain Events dispatched by Aggregate Roots.
/// </summary>
public interface IDomainEvent
{
    Guid EventId { get; }
    DateTime OccurredOnUtc { get; }
}
