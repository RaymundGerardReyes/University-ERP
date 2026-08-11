namespace Finance.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class CashTransaction : AggregateRoot<Guid>
{
    public string TransactionToken { get; private set; } = string.Empty;
    public string ReferenceId { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public string Status { get; private set; } = string.Empty;
    public DateTime CreatedOnUtc { get; private set; }
    public DateTime? CompletedOnUtc { get; private set; }

    // Required for Entity Framework Core parameterless initialization
    private CashTransaction() { }

    private CashTransaction(Guid id, string transactionToken, string referenceId, decimal amount) : base(id)
    {
        TransactionToken = transactionToken;
        ReferenceId = referenceId;
        Amount = amount;
        Status = "Pending";
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Result<CashTransaction> Create(string referenceId, decimal amount)
    {
        if (string.IsNullOrWhiteSpace(referenceId))
        {
            return Result<CashTransaction>.Failure(new Error("CashTransaction.InvalidReference", "A reference ID is required."));
        }

        if (amount <= 0)
        {
            return Result<CashTransaction>.Failure(new Error("CashTransaction.InvalidAmount", "Amount must be greater than zero."));
        }

        // Generate a secure, readable token for the cashier (e.g., TXN-CSH-20260811-ABCD)
        string token = $"TXN-CSH-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";

        return Result<CashTransaction>.Success(new CashTransaction(Guid.NewGuid(), token, referenceId, amount));
    }

    public Result<bool> Complete()
    {
        if (Status != "Pending")
        {
            return Result<bool>.Failure(new Error("CashTransaction.AlreadyProcessed", "This transaction is no longer pending."));
        }

        Status = "Completed";
        CompletedOnUtc = DateTime.UtcNow;

        return Result<bool>.Success(true);
    }

    public Result<bool> Cancel()
    {
        if (Status != "Pending")
        {
            return Result<bool>.Failure(new Error("CashTransaction.AlreadyProcessed", "This transaction cannot be cancelled."));
        }

        Status = "Cancelled";
        return Result<bool>.Success(true);
    }
}