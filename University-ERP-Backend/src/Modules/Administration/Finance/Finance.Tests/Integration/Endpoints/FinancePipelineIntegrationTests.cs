namespace Finance.Tests.Integration.Endpoints;

using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Features.ApplyScholarship;
using Finance.Application.Features.AssessTuition;
using Finance.Application.Features.ClearBalance;
using Finance.Application.Features.IssueInvoice;
using Finance.Application.Features.ProcessPayment;
using Finance.Domain.Aggregates;
using Finance.Infrastructure.Repositories;
using FluentAssertions;
using Xunit;

public class FinancePipelineIntegrationTests : IntegrationTestBase
{
    // 41. IssueInvoicePipeline_Should_Persist_Data_When_Valid
    [Fact]
    public async Task IssueInvoicePipeline_Should_Persist_Data_When_Valid()
    {
        var repo = new StudentBillingRepository(DbContext);
        var handler = new IssueInvoiceCommandHandler(repo);
        var command = new IssueInvoiceCommand(Guid.NewGuid(), 5000m, "Semester Tuition");

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        var persisted = await repo.GetByIdAsync(result.Value);
        persisted.Should().NotBeNull();
        persisted!.TotalAmount.Should().Be(5000m);
    }

    // 42. IssueInvoicePipeline_Should_Return_Failure_When_Amount_Is_Negative
    [Fact]
    public async Task IssueInvoicePipeline_Should_Return_Failure_When_Amount_Is_Negative()
    {
        var repo = new StudentBillingRepository(DbContext);
        var handler = new IssueInvoiceCommandHandler(repo);
        var command = new IssueInvoiceCommand(Guid.NewGuid(), -100m, "Invalid");

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidAmount");
    }

    // 43. ProcessPaymentPipeline_Should_Update_Balance_When_Valid
    [Fact]
    public async Task ProcessPaymentPipeline_Should_Update_Balance_When_Valid()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Tuition").Value;
        await repo.AddAsync(billing);

        var handler = new ProcessPaymentCommandHandler(repo);
        var command = new ProcessPaymentCommand(studentId, 1000m);
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        var updated = await repo.GetByStudentIdAsync(studentId);
        updated!.Status.Should().Be("PartiallyPaid");
        updated.PaidAmount.Should().Be(1000m);
    }

    // 44. ProcessPaymentPipeline_Should_Return_Failure_When_Invoice_Does_Not_Exist
    [Fact]
    public async Task ProcessPaymentPipeline_Should_Return_Failure_When_Invoice_Does_Not_Exist()
    {
        var repo = new StudentBillingRepository(DbContext);
        var handler = new ProcessPaymentCommandHandler(repo);
        var command = new ProcessPaymentCommand(Guid.NewGuid(), 100m);

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.NotFound");
    }

    // 45. ProcessPaymentPipeline_Should_Return_Failure_When_Amount_Is_Zero
    [Fact]
    public async Task ProcessPaymentPipeline_Should_Return_Failure_When_Amount_Is_Zero()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Tuition").Value;
        await repo.AddAsync(billing);

        var handler = new ProcessPaymentCommandHandler(repo);
        var command = new ProcessPaymentCommand(studentId, 0m);
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidPayment");
    }

    // 46. ApplyScholarshipPipeline_Should_Apply_Discount_When_Valid
    [Fact]
    public async Task ApplyScholarshipPipeline_Should_Apply_Discount_When_Valid()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Tuition").Value;
        await repo.AddAsync(billing);

        var handler = new ApplyScholarshipCommandHandler(repo);
        var command = new ApplyScholarshipCommand(studentId, 500m, "Academic");
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        var updated = await repo.GetByStudentIdAsync(studentId);
        updated!.TotalAmount.Should().Be(1500m);
    }

    // 47. ApplyScholarshipPipeline_Should_Return_Failure_When_Exceeding_Balance
    [Fact]
    public async Task ApplyScholarshipPipeline_Should_Return_Failure_When_Exceeding_Balance()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Tuition").Value;
        await repo.AddAsync(billing);

        var handler = new ApplyScholarshipCommandHandler(repo);
        var command = new ApplyScholarshipCommand(studentId, 2500m, "Academic");
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidDeduction");
    }

    // 48. ClearBalancePipeline_Should_Return_Success_When_Balance_Is_Zero
    [Fact]
    public async Task ClearBalancePipeline_Should_Return_Success_When_Balance_Is_Zero()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Tuition").Value;
        billing.ProcessPayment(2000m);
        await repo.AddAsync(billing);

        var handler = new ClearBalanceCommandHandler(repo);
        var command = new ClearBalanceCommand(studentId);
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        var updated = await repo.GetByStudentIdAsync(studentId);
        updated!.Status.Should().Be("Cleared");
    }

    // 49. ClearBalancePipeline_Should_Return_Failure_When_Debt_Remains
    [Fact]
    public async Task ClearBalancePipeline_Should_Return_Failure_When_Debt_Remains()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Tuition").Value;
        billing.ProcessPayment(1000m);
        await repo.AddAsync(billing);

        var handler = new ClearBalanceCommandHandler(repo);
        var command = new ClearBalanceCommand(studentId);
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BalanceRemaining");
    }

    // 50. AssessTuitionPipeline_Should_Increase_Tuition_Amount
    [Fact]
    public async Task AssessTuitionPipeline_Should_Increase_Tuition_Amount()
    {
        var repo = new StudentBillingRepository(DbContext);
        var studentId = Guid.NewGuid();
        var billing = StudentBilling.IssueInvoice(studentId, 2000m, "Base Tuition").Value;
        await repo.AddAsync(billing);

        var handler = new AssessTuitionCommandHandler(repo);
        var command = new AssessTuitionCommand(studentId, 500m);
        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        var updated = await repo.GetByStudentIdAsync(studentId);
        updated!.TotalAmount.Should().Be(2500m);
    }
}
