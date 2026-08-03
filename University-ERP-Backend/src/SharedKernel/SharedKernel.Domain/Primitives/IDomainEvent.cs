namespace SharedKernel.Domain.Primitives;

using MediatR;

/// <summary>
/// Marker interface for all Domain Events dispatched by Aggregate Roots.
/// </summary>
public interface IDomainEvent : INotification
{
    Guid EventId { get; }
    DateTime OccurredOnUtc { get; }
}
