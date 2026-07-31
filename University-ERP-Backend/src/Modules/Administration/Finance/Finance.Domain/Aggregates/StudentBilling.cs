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
        {
            return Result<StudentBilling>.Failure(new Error("Finance.InvalidAmount", "Invoice amount must be greater than zero."));
        }

        if (string.IsNullOrWhiteSpace(description))
        {
            return Result<StudentBilling>.Failure(new Error("Finance.InvalidDescription", "Invoice description is required."));
        }

        return Result<StudentBilling>.Success(new StudentBilling(Guid.NewGuid(), studentId, amount, description));
    }
}
