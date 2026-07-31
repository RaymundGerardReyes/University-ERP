namespace EventManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class CampusEvent : AggregateRoot<Guid>
{
    public string EventName { get; private set; } = string.Empty;
    public string OrganizerId { get; private set; } = string.Empty;
    public string Venue { get; private set; } = string.Empty;
    public DateTime ScheduledDate { get; private set; }
    public int MaxCapacity { get; private set; }
    public string Status { get; private set; } = string.Empty;

    private CampusEvent() { }

    private CampusEvent(Guid id, string eventName, string organizerId, string venue, DateTime scheduledDate, int maxCapacity) : base(id)
    {
        EventName = eventName;
        OrganizerId = organizerId;
        Venue = venue;
        ScheduledDate = scheduledDate;
        MaxCapacity = maxCapacity;
        Status = "Planned";
    }

    public static Result<CampusEvent> Plan(string eventName, string organizerId, string venue, DateTime scheduledDate, int maxCapacity)
    {
        if (string.IsNullOrWhiteSpace(eventName))
        {
            return Result<CampusEvent>.Failure(new Error("Event.InvalidName", "Event name is required."));
        }

        if (maxCapacity <= 0)
        {
            return Result<CampusEvent>.Failure(new Error("Event.InvalidCapacity", "Capacity must be greater than zero."));
        }

        return Result<CampusEvent>.Success(new CampusEvent(Guid.NewGuid(), eventName, organizerId, venue, scheduledDate, maxCapacity));
    }
}
