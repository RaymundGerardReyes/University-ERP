namespace Finance.Tests.Unit.Domain.Aggregates;

using Finance.Domain.Aggregates;
using FluentAssertions;
using Xunit;
using System;

// Source under test: Finance.Domain/Aggregates/StudentBilling.cs
public class StudentBillingTests
{
    [Fact]
    public void Should_Create_Valid_StudentBilling_With_Pending_Status()
    {
        // Arrange
        var studentId = Guid.NewGuid();
        var amount = 1500.50m;
        var description = "Fall Semester Tuition";

        // Act
        var result = StudentBilling.IssueInvoice(studentId, amount, description);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.StudentId.Should().Be(studentId);
        result.Value.TotalAmount.Should().Be(amount);
        result.Value.PaidAmount.Should().Be(0m);
        result.Value.Description.Should().Be(description);
        result.Value.Status.Should().Be("Unpaid");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-100.50)]
    public void Should_Reject_Invoice_Creation_When_Amount_Is_Zero_Or_Negative(decimal invalidAmount)
    {
        // Arrange & Act
        var result = StudentBilling.IssueInvoice(Guid.NewGuid(), invalidAmount, "Valid description");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidAmount");
    }

    [Fact]
    public void Should_Successfully_ProcessPayment_And_Change_Status_To_PartiallyPaid()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        // Act
        var result = billing.ProcessPayment(500m);

        // Assert
        result.IsSuccess.Should().BeTrue();
        billing.PaidAmount.Should().Be(500m);
        billing.Status.Should().Be("PartiallyPaid");
    }

    [Fact]
    public void Should_Successfully_ProcessPayment_And_Change_Status_To_FullyPaid()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        // Act
        var result = billing.ProcessPayment(1000m);

        // Assert
        result.IsSuccess.Should().BeTrue();
        billing.PaidAmount.Should().Be(1000m);
        billing.Status.Should().Be("FullyPaid");
    }

    [Fact]
    public void Should_Reject_ProcessPayment_When_Amount_Is_Zero_Or_Negative()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        // Act
        var result = billing.ProcessPayment(0m);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidPayment");
    }

    [Fact]
    public void Should_Successfully_Apply_Scholarship_And_Reduce_TotalAmount()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        // Act
        var result = billing.ApplyScholarship(300m, "Merit Scholarship");

        // Assert
        result.IsSuccess.Should().BeTrue();
        billing.TotalAmount.Should().Be(700m);
        billing.Description.Should().Contain("Grant Applied: Merit Scholarship");
    }

    [Fact]
    public void Should_Reject_Scholarship_Exceeding_Remaining_Balance()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        // Act
        var result = billing.ApplyScholarship(1200m, "Full Ride");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidDeduction");
    }

    [Fact]
    public void Should_ClearBalance_When_Fully_Paid()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;
        billing.ProcessPayment(1000m);

        // Act
        var result = billing.ClearBalance();

        // Assert
        result.IsSuccess.Should().BeTrue();
        billing.Status.Should().Be("Cleared");
    }

    [Fact]
    public void Should_Reject_ClearBalance_When_Outstanding_Debt_Exists()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;
        billing.ProcessPayment(500m);

        // Act
        var result = billing.ClearBalance();

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BalanceRemaining");
    }

    [Fact]
    public void Should_Successfully_AdjustTuition_And_Update_Status_To_PAID_When_Total_Is_Zero()
    {
        // Arrange
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        // Act
        var result = billing.AdjustTuition(-1000m, "Full waiver");

        // Assert
        result.IsSuccess.Should().BeTrue();
        billing.TotalAmount.Should().Be(0m);
        billing.Status.Should().Be("PAID");
        billing.Description.Should().Contain("Adjustment: Full waiver");
    }
}
