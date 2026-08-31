namespace DomainTests.Inventory;

using Xunit;
using Inventory.Domain.Aggregates;
using System.Threading.Tasks;

public class InventoryStockInvariantTests
{
    [Fact]
    public async Task AdjustQuantity_PreventsNegativeStock_WhenReductionExceedsAvailable()
    {
        // Arrange
        var stockItemResult = StockItem.Create("Laboratory Microscope", "Equipment", 5, 2, "Building B");
        var stockItem = stockItemResult.Value;

        // Act
        var result = stockItem.AdjustQuantity(-10);

        // Assert
        Assert.True(result.IsFailure);
        Assert.Equal("Inventory.InsufficientStock", result.Error.Code);
        Assert.Equal(5, stockItem.Quantity); // Quantity remains unchanged
    }
}
