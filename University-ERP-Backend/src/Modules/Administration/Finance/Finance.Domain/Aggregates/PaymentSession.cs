namespace Finance.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class PaymentSession : AggregateRoot<Guid>
{
    public string SessionId { get; private set; } = string.Empty;
    public string InvoiceId { get; private set; } = string.Empty;
    public string ApplicantId { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public string Currency { get; private set; } = "PHP";
    public string Purpose { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public string? IdempotencyKey { get; private set; }
    public string? BankReference { get; private set; }
    public string? GatewayTransactionId { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime ExpiresAtUtc { get; private set; }
    public DateTime? ConsumedAtUtc { get; private set; }

    private PaymentSession() { }

    private PaymentSession(Guid id, string sessionId, string invoiceId, string applicantId, decimal amount, string purpose) : base(id)
    {
        SessionId = sessionId;
        InvoiceId = invoiceId;
        ApplicantId = applicantId;
        Amount = amount;
        Purpose = purpose;
        Status = "AwaitingPayment";
        CreatedAtUtc = DateTime.UtcNow;
        // Session valid for 30 minutes
        ExpiresAtUtc = DateTime.UtcNow.AddMinutes(30);
    }

    public static Result<PaymentSession> Create(string invoiceId, string applicantId, decimal amount, string purpose)
    {
        if (amount <= 0) return Result<PaymentSession>.Failure(new Error("PaymentSession.InvalidAmount", "Amount must be greater than zero."));
        
        // Generate an opaque, unpredictable session ID
        string sessionId = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
            .Replace("/", "_")
            .Replace("+", "-")
            .Substring(0, 22);

        return Result<PaymentSession>.Success(new PaymentSession(Guid.NewGuid(), sessionId, invoiceId, applicantId, amount, purpose));
    }

    public Result<bool> InitiatePayment(string idempotencyKey, string gatewayTransactionId)
    {
        if (Status == "Paid" || Status == "Completed")
            return Result<bool>.Failure(new Error("PaymentSession.AlreadyPaid", "Session is already paid."));
            
        if (DateTime.UtcNow > ExpiresAtUtc)
        {
            Status = "Expired";
            return Result<bool>.Failure(new Error("PaymentSession.Expired", "This payment session has expired."));
        }

        IdempotencyKey = idempotencyKey;
        GatewayTransactionId = gatewayTransactionId;
        Status = "PendingBankConfirmation";

        return Result<bool>.Success(true);
    }

    public Result<bool> ConfirmPayment(string bankReference)
    {
        if (Status == "Paid")
            return Result<bool>.Failure(new Error("PaymentSession.DuplicateConfirmation", "Payment was already confirmed."));

        if (Status == "Expired" || Status == "Cancelled" || Status == "Reversed")
            return Result<bool>.Failure(new Error("PaymentSession.InvalidState", $"Session cannot be confirmed because it is {Status}."));

        Status = "Paid";
        BankReference = bankReference;
        ConsumedAtUtc = DateTime.UtcNow;

        return Result<bool>.Success(true);
    }

    public Result<bool> Expire()
    {
        if (Status == "Paid")
             return Result<bool>.Failure(new Error("PaymentSession.CannotExpire", "Paid session cannot be expired."));
             
        Status = "Expired";
        return Result<bool>.Success(true);
    }

    // Retaining legacy Complete method temporarily for backwards compatibility with existing handlers if needed
    public Result<bool> Complete()
    {
        if (Status != "AwaitingPayment" && Status != "PendingBankConfirmation")
            return Result<bool>.Failure(new Error("PaymentSession.InvalidState", $"Session cannot be completed because it is {Status}."));

        if (DateTime.UtcNow > ExpiresAtUtc)
        {
            Status = "Expired";
            return Result<bool>.Failure(new Error("PaymentSession.Expired", "This payment session has expired."));
        }

        Status = "Paid"; // Aligned with new standard
        ConsumedAtUtc = DateTime.UtcNow;

        return Result<bool>.Success(true);
    }
}
