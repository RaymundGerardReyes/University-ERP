namespace Finance.Tests.Integration.Persistence;

using System;
using System.Threading.Tasks;
using Finance.Domain.Aggregates;
using Finance.Infrastructure.Repositories;
using FluentAssertions;
using Xunit;

public class FinanceRepositoriesIntegrationTests : IntegrationTestBase
{
    // 31. StudentBillingRepo_Should_Successfully_AddAsync_And_Persist_To_Database
    [Fact]
    public async Task StudentBillingRepo_Should_Successfully_AddAsync_And_Persist_To_Database()
    {
        var repo = new StudentBillingRepository(DbContext);
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;

        await repo.AddAsync(billing);
        
        var persisted = await repo.GetByIdAsync(billing.Id);
        persisted.Should().NotBeNull();
        persisted!.TotalAmount.Should().Be(1000m);
    }

    // 32. StudentBillingRepo_Should_Successfully_GetByIdAsync_From_Database
    [Fact]
    public async Task StudentBillingRepo_Should_Successfully_GetByIdAsync_From_Database()
    {
        var repo = new StudentBillingRepository(DbContext);
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1500m, "Lab Fees").Value;
        await repo.AddAsync(billing);

        var retrieved = await repo.GetByIdAsync(billing.Id);

        retrieved.Should().NotBeNull();
        retrieved!.Description.Should().Be("Lab Fees");
    }

    // 33. StudentBillingRepo_Should_Return_Null_For_NonExistent_Id
    [Fact]
    public async Task StudentBillingRepo_Should_Return_Null_For_NonExistent_Id()
    {
        var repo = new StudentBillingRepository(DbContext);

        var retrieved = await repo.GetByIdAsync(Guid.NewGuid());

        retrieved.Should().BeNull();
    }

    // 34. StudentBillingRepo_Should_Successfully_UpdateAsync_And_Save_Changes
    [Fact]
    public async Task StudentBillingRepo_Should_Successfully_UpdateAsync_And_Save_Changes()
    {
        var repo = new StudentBillingRepository(DbContext);
        var billing = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;
        await repo.AddAsync(billing);

        billing.ProcessPayment(500m);
        await repo.UpdateAsync(billing);

        var updated = await repo.GetByIdAsync(billing.Id);
        updated!.Status.Should().Be("PartiallyPaid");
        updated.PaidAmount.Should().Be(500m);
    }

    // 35. CashTransactionRepo_Should_Successfully_AddAsync_And_Persist_To_Database
    [Fact]
    public async Task CashTransactionRepo_Should_Successfully_AddAsync_And_Persist_To_Database()
    {
        var repo = new CashTransactionRepository(DbContext);
        var transaction = CashTransaction.Create("REF-001", 500m).Value;

        await repo.AddAsync(transaction);
        await repo.SaveChangesAsync();

        var persisted = await repo.GetByTokenAsync(transaction.TransactionToken);
        persisted.Should().NotBeNull();
        persisted!.Amount.Should().Be(500m);
    }

    // 36. Adapted: CashTransactionRepo_Should_Successfully_GetByTokenAsync_From_Database
    [Fact]
    public async Task CashTransactionRepo_Should_Successfully_GetByTokenAsync_From_Database()
    {
        var repo = new CashTransactionRepository(DbContext);
        var transaction = CashTransaction.Create("REF-002", 750m).Value;
        await repo.AddAsync(transaction);
        await repo.SaveChangesAsync();

        var retrieved = await repo.GetByTokenAsync(transaction.TransactionToken);

        retrieved.Should().NotBeNull();
        retrieved!.ReferenceId.Should().Be("REF-002");
    }

    // 37. Adapted: CashTransactionRepo_Should_Return_Null_For_NonExistent_Token
    [Fact]
    public async Task CashTransactionRepo_Should_Return_Null_For_NonExistent_Token()
    {
        var repo = new CashTransactionRepository(DbContext);

        var retrieved = await repo.GetByTokenAsync("INVALID-TOKEN");

        retrieved.Should().BeNull();
    }

    // 38. PaymentSessionRepo_Should_Successfully_AddAsync_And_Persist_To_Database
    [Fact]
    public async Task PaymentSessionRepo_Should_Successfully_AddAsync_And_Persist_To_Database()
    {
        var repo = new PaymentSessionRepository(DbContext);
        var session = PaymentSession.Create("INV-01", "APP-01", 200m, "Fee").Value;

        await repo.AddAsync(session);
        await repo.SaveChangesAsync();

        var persisted = await repo.GetBySessionIdAsync(session.SessionId);
        persisted.Should().NotBeNull();
        persisted!.Amount.Should().Be(200m);
    }

    // 39. Adapted: PaymentSessionRepo_Should_Successfully_GetBySessionIdAsync_From_Database
    [Fact]
    public async Task PaymentSessionRepo_Should_Successfully_GetBySessionIdAsync_From_Database()
    {
        var repo = new PaymentSessionRepository(DbContext);
        var session = PaymentSession.Create("INV-02", "APP-02", 300m, "Fee").Value;
        await repo.AddAsync(session);
        await repo.SaveChangesAsync();

        var retrieved = await repo.GetBySessionIdAsync(session.SessionId);

        retrieved.Should().NotBeNull();
        retrieved!.InvoiceId.Should().Be("INV-02");
    }

    // 40. PaymentSessionRepo_Should_Successfully_UpdateAsync_Status_Changes
    [Fact]
    public async Task PaymentSessionRepo_Should_Successfully_UpdateAsync_Status_Changes()
    {
        var repo = new PaymentSessionRepository(DbContext);
        var session = PaymentSession.Create("INV-03", "APP-03", 400m, "Fee").Value;
        await repo.AddAsync(session);
        await repo.SaveChangesAsync();

        session.InitiatePayment("IDEM-01", "GW-01");
        await repo.SaveChangesAsync();

        var updated = await repo.GetBySessionIdAsync(session.SessionId);
        updated!.Status.Should().Be("PendingBankConfirmation");
    }
}
