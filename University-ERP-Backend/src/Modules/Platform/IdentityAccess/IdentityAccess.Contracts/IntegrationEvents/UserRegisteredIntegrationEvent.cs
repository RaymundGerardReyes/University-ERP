namespace IdentityAccess.Contracts.IntegrationEvents;

/// <summary>
/// Integration event published to the message broker when a new user is registered.
/// Other bounded contexts (e.g., StudentInformation, HumanResources) subscribe to this event.
/// Notice it uses primitive types (Guid, string) to prevent cross-module domain coupling.
/// </summary>
public sealed record UserRegisteredIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid UserId,
    string Email,
    string FullName
);
