namespace Finance.Tests.Unit.Domain.Aggregates;

using System;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Xunit;

public class CashTransactionTests
{
    // 16. CashTransaction_Should_Create_Valid_Transaction_With_Pending_Status
    [Fact]
    public void Should_Create_Valid_Transaction_With_Pending_Status()
    {
        var result = CashTransaction.Create("REF-999", 500m);

        result.IsSuccess.Should().BeTrue();
        result.Value.Status.Should().Be("Pending");
        result.Value.TransactionToken.Should().StartWith("TXN-CSH-");
        result.Value.Amount.Should().Be(500m);
    }

    // 17. CashTransaction_Should_Reject_Creation_When_Amount_Is_Zero_Or_Negative
    [Theory]
    [InlineData(0)]
    [InlineData(-100)]
    public void Should_Reject_Creation_When_Amount_Is_Zero_Or_Negative(decimal invalidAmount)
    {
        var result = CashTransaction.Create("REF-999", invalidAmount);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("CashTransaction.InvalidAmount");
    }

    // 18. CashTransaction_Should_Successfully_Mark_As_Completed
    [Fact]
    public void Should_Successfully_Mark_As_Completed()
    {
        var transaction = CashTransaction.Create("REF-999", 500m).Value;

        var result = transaction.Complete();

        result.IsSuccess.Should().BeTrue();
        transaction.Status.Should().Be("Completed");
        transaction.CompletedOnUtc.Should().NotBeNull();
    }

    // 19. Adapted: CashTransaction_Should_Successfully_Cancel_Transaction
    [Fact]
    public void Should_Successfully_Cancel_Transaction()
    {
        var transaction = CashTransaction.Create("REF-999", 500m).Value;

        var result = transaction.Cancel();

        result.IsSuccess.Should().BeTrue();
        transaction.Status.Should().Be("Cancelled");
    }

    // 20. Adapted: CashTransaction_Should_Reject_Completion_If_Already_Cancelled
    [Fact]
    public void Should_Reject_Completion_If_Already_Cancelled()
    {
        var transaction = CashTransaction.Create("REF-999", 500m).Value;
        transaction.Cancel();

        var result = transaction.Complete();

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("CashTransaction.AlreadyProcessed");
    }

    // 21. Adapted: CashTransaction_Should_Reject_Cancel_If_Already_Completed
    [Fact]
    public void Should_Reject_Cancel_If_Already_Completed()
    {
        var transaction = CashTransaction.Create("REF-999", 500m).Value;
        transaction.Complete();

        var result = transaction.Cancel();

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("CashTransaction.AlreadyProcessed");
    }

    // 22. Adapted: CashTransaction_Should_Reject_Creation_When_ReferenceId_Is_Empty
    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Should_Reject_Creation_When_ReferenceId_Is_Empty(string invalidRef)
    {
        var result = CashTransaction.Create(invalidRef, 500m);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("CashTransaction.InvalidReference");
    }
}
