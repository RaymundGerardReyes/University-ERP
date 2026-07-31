namespace MultiCampus.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Campus : AggregateRoot<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public string Location { get; private set; } = string.Empty;
    public string TenantId { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime EstablishedOnUtc { get; private set; }

    private Campus() { }

    private Campus(Guid id, string name, string location, string tenantId) : base(id)
    {
        Name = name;
        Location = location;
        TenantId = tenantId;
        IsActive = true;
        EstablishedOnUtc = DateTime.UtcNow;
    }

    public static Result<Campus> Configure(string name, string location, string tenantId)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result<Campus>.Failure(new Error("MultiCampus.InvalidName", "Campus name is required."));
            
        if (string.IsNullOrWhiteSpace(tenantId))
            return Result<Campus>.Failure(new Error("MultiCampus.InvalidTenant", "Tenant ID is required for isolation."));

        return Result<Campus>.Success(new Campus(Guid.NewGuid(), name, location, tenantId));
    }
}
