namespace Finance.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class StudentBilling : AggregateRoot<Guid>
{
    public Guid StudentId { get; private set; }
    public decimal TotalAmount { get; private set; }
    public decimal PaidAmount { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime IssuedOnUtc { get; private set; }

    private StudentBilling() { }

    private StudentBilling(Guid id, Guid studentId, decimal amount, string description) : base(id)
    {
        StudentId = studentId;
        TotalAmount = amount;
        PaidAmount = 0m;
        Description = description;
        Status = "Unpaid";
        IssuedOnUtc = DateTime.UtcNow;
    }

    public static Result<StudentBilling> IssueInvoice(Guid studentId, decimal amount, string description)
    {
        if (amount <= 0)
            return Result<StudentBilling>.Failure(new Error("Finance.InvalidAmount", "Invoice amount must be greater than zero."));

        if (string.IsNullOrWhiteSpace(description))
            return Result<StudentBilling>.Failure(new Error("Finance.InvalidDescription", "Invoice description is required."));

        return Result<StudentBilling>.Success(new StudentBilling(Guid.NewGuid(), studentId, amount, description));
    }

    public Result<bool> AssessTuition(decimal amount)
    {
        if (Status == "Cleared") return Result<bool>.Failure(new Error("Finance.AlreadyCleared", "Cannot assess tuition on a cleared ledger."));
        TotalAmount += amount;
        return Result<bool>.Success(true);
    }

    public Result<bool> ApplyScholarship(decimal deduction, string grantType)
    {
        if (Status == "Cleared") return Result<bool>.Failure(new Error("Finance.AlreadyCleared", "Cannot apply scholarship to a cleared ledger."));
        if (deduction > TotalAmount - PaidAmount) return Result<bool>.Failure(new Error("Finance.InvalidDeduction", "Scholarship deduction exceeds remaining balance."));
        
        TotalAmount -= deduction;
        Description += $" | Grant Applied: {grantType}";
        return Result<bool>.Success(true);
    }

    public Result<bool> ProcessPayment(decimal amount)
    {
        if (amount <= 0) return Result<bool>.Failure(new Error("Finance.InvalidPayment", "Payment amount must be greater than zero."));
        
        PaidAmount += amount;
        if (PaidAmount >= TotalAmount)
        {
            Status = "FullyPaid";
        }
        else
        {
            Status = "PartiallyPaid";
        }
        return Result<bool>.Success(true);
    }

    public Result<bool> ClearBalance()
    {
        if (PaidAmount < TotalAmount) return Result<bool>.Failure(new Error("Finance.BalanceRemaining", "Cannot clear balance. Ledger has outstanding debt."));
        Status = "Cleared";
        return Result<bool>.Success(true);
    }
}
