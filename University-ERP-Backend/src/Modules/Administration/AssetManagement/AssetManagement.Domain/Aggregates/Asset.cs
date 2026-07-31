namespace AssetManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Asset : AggregateRoot<Guid>
{
    public string AssetName { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string SerialNumber { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public decimal PurchaseValue { get; private set; }
    public DateTime AcquiredOnUtc { get; private set; }

    private Asset() { }

    private Asset(Guid id, string assetName, string category, string serialNumber, decimal purchaseValue) : base(id)
    {
        AssetName = assetName;
        Category = category;
        SerialNumber = serialNumber;
        PurchaseValue = purchaseValue;
        Status = "Active";
        AcquiredOnUtc = DateTime.UtcNow;
    }

    public static Result<Asset> Register(string assetName, string category, string serialNumber, decimal purchaseValue)
    {
        if (string.IsNullOrWhiteSpace(assetName))
        {
            return Result<Asset>.Failure(new Error("AssetManagement.InvalidName", "Asset name is required."));
        }

        return Result<Asset>.Success(new Asset(Guid.NewGuid(), assetName, category, serialNumber, purchaseValue));
    }
}
