namespace Transport.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;

public sealed class BusRoute : AggregateRoot<Guid>
{
    public string RouteName { get; private set; } = string.Empty;
    public string VehiclePlateNumber { get; private set; } = string.Empty;
    public string DriverId { get; private set; } = string.Empty;
    public int Capacity { get; private set; }
    public string Status { get; private set; } = string.Empty;
    public DateTime CreatedOnUtc { get; private set; }

    private BusRoute() { }

    private BusRoute(Guid id, string routeName, string plateNumber, int capacity) : base(id)
    {
        RouteName = routeName;
        VehiclePlateNumber = plateNumber;
        Capacity = capacity;
        Status = "Unassigned";
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Result<BusRoute> Create(string routeName, string plateNumber, int capacity)
    {
        if (string.IsNullOrWhiteSpace(routeName))
        {
            return Result<BusRoute>.Failure(new Error("Transport.InvalidRoute", "Route name is required."));
        }

        return Result<BusRoute>.Success(new BusRoute(Guid.NewGuid(), routeName, plateNumber, capacity));
    }

    public Result<bool> AssignDriver(string driverId)
    {
        if (string.IsNullOrWhiteSpace(driverId))
        {
            return Result<bool>.Failure(new Error("Transport.InvalidDriver", "Driver ID cannot be empty."));
        }

        DriverId = driverId;
        Status = "Active";
        return Result<bool>.Success(true);
    }
}
