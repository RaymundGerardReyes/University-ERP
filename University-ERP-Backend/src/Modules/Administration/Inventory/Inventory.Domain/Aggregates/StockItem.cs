namespace Inventory.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class StockItem : AggregateRoot<Guid>
{
    public string ItemName { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public int Quantity { get; private set; }
    public int ReorderLevel { get; private set; }
    public string StorageLocation { get; private set; } = string.Empty;
    public DateTime LastUpdatedUtc { get; private set; }

    private StockItem() { }

    private StockItem(Guid id, string itemName, string category, int initialQuantity, int reorderLevel, string location) : base(id)
    {
        ItemName = itemName;
        Category = category;
        Quantity = initialQuantity;
        ReorderLevel = reorderLevel;
        StorageLocation = location;
        LastUpdatedUtc = DateTime.UtcNow;
    }

    public static Result<StockItem> Create(string itemName, string category, int initialQuantity, int reorderLevel, string location)
    {
        if (string.IsNullOrWhiteSpace(itemName))
        {
            return Result<StockItem>.Failure(new Error("Inventory.InvalidName", "Item name is required."));
        }

        return Result<StockItem>.Success(new StockItem(Guid.NewGuid(), itemName, category, initialQuantity, reorderLevel, location));
    }

    public Result<bool> AdjustQuantity(int amount)
    {
        if (Quantity + amount < 0)
        {
            return Result<bool>.Failure(new Error("Inventory.InsufficientStock", "Cannot reduce stock below zero."));
        }
        
        Quantity += amount;
        LastUpdatedUtc = DateTime.UtcNow;
        return Result<bool>.Success(true);
    }
}
