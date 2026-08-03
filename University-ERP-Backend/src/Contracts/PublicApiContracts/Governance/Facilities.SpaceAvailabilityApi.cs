namespace Contracts.PublicApiContracts.Governance;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Open Host Service contract exposed by the Governance/Facilities Bounded Context.
/// Used synchronously to verify room availability before allowing bookings.
/// </summary>
public interface IFacilitiesSpaceAvailabilityApi
{
    /// <summary>
    /// Queries the availability of a specific room for a given time block.
    /// </summary>
    Task<bool> IsRoomAvailableAsync(string roomName, DateTime startTime, DateTime endTime, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a list of available rooms for a given capacity and time block.
    /// </summary>
    Task<IReadOnlyCollection<RoomAvailabilityDto>> GetAvailableRoomsAsync(int minimumCapacity, DateTime startTime, DateTime endTime, CancellationToken cancellationToken = default);
}

public sealed record RoomAvailabilityDto(
    string RoomName,
    int Capacity,
    string BuildingName
);
