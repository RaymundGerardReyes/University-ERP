namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using System;
using Finance.Domain.Aggregates;

public class InvoiceBalancingTests
{
    [Fact]
    public void IssueInvoice_WithZeroOrNegativeAmount_FailsInvariant()
    {
        var resultZero = StudentBilling.IssueInvoice(Guid.NewGuid(), 0m, "Tuition Fall");
        resultZero.IsFailure.Should().BeTrue();
        resultZero.Error.Code.Should().Be("Finance.InvalidAmount");

        var resultNegative = StudentBilling.IssueInvoice(Guid.NewGuid(), -100m, "Tuition Fall");
        resultNegative.IsFailure.Should().BeTrue();
        resultNegative.Error.Code.Should().Be("Finance.InvalidAmount");
    }

    [Fact]
    public void IssueInvoice_WithEmptyDescription_FailsInvariant()
    {
        var result = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "   ");
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidDescription");
    }

    [Fact]
    public void ClearBalance_WithRemainingDebt_FailsInvariant()
    {
        var invoice = StudentBilling.IssueInvoice(Guid.NewGuid(), 2500m, "Term Tuition").Value;
        invoice.ProcessPayment(1000m);

        var clearResult = invoice.ClearBalance();
        clearResult.IsFailure.Should().BeTrue();
        clearResult.Error.Code.Should().Be("Finance.BalanceRemaining");
    }

    [Fact]
    public void ClearBalance_WhenFullyPaid_Succeeds()
    {
        var invoice = StudentBilling.IssueInvoice(Guid.NewGuid(), 2500m, "Term Tuition").Value;
        invoice.ProcessPayment(2500m);

        var clearResult = invoice.ClearBalance();
        clearResult.IsSuccess.Should().BeTrue();
        invoice.Status.Should().Be("Cleared");
    }

    [Fact]
    public void ApplyScholarship_ExceedingRemainingBalance_FailsInvariant()
    {
        var invoice = StudentBilling.IssueInvoice(Guid.NewGuid(), 3000m, "Term Tuition").Value;
        invoice.ProcessPayment(1500m); // Remaining is 1500m

        var grantResult = invoice.ApplyScholarship(2000m, "Merit Fellowship");
        grantResult.IsFailure.Should().BeTrue();
        grantResult.Error.Code.Should().Be("Finance.InvalidDeduction");
    }

    [Fact]
    public void ApplyScholarship_WithinBalance_ReducesTotalAndAppendsDescription()
    {
        var invoice = StudentBilling.IssueInvoice(Guid.NewGuid(), 3000m, "Term Tuition").Value;

        var grantResult = invoice.ApplyScholarship(1000m, "Dean's Excellence Grant");
        grantResult.IsSuccess.Should().BeTrue();
        invoice.TotalAmount.Should().Be(2000m);
        invoice.Description.Should().Contain("Dean's Excellence Grant");
    }

    [Fact]
    public void AssessTuition_OnClearedLedger_FailsInvariant()
    {
        var invoice = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Initial Fee").Value;
        invoice.ProcessPayment(1000m);
        invoice.ClearBalance();

        var assessResult = invoice.AssessTuition(500m);
        assessResult.IsFailure.Should().BeTrue();
        assessResult.Error.Code.Should().Be("Finance.AlreadyCleared");
    }

    [Fact]
    public void RecordPayment_TransitionsStatusAccurately()
    {
        var invoice = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Lab Fees").Value;
        invoice.RecordPayment(500m);
        invoice.Status.Should().Be("PARTIAL");

        invoice.RecordPayment(500m);
        invoice.Status.Should().Be("PAID");
    }
}
