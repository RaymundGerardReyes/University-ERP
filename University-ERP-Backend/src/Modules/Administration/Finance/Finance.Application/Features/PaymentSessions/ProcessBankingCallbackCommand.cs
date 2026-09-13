namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using Contracts.IntegrationEvents.Administration;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ProcessBankingCallbackCommand(
    string SessionId, 
    string BankReference, 
    string BankStatus,
    decimal AmountPaid) : IRequest<Result<bool>>;

public sealed class ProcessBankingCallbackCommandHandler : IRequestHandler<ProcessBankingCallbackCommand, Result<bool>>
{
    private readonly IPaymentSessionRepository _sessionRepository;
    private readonly IStudentBillingRepository _billingRepository;
    private readonly IPublisher _publisher;

    public ProcessBankingCallbackCommandHandler(
        IPaymentSessionRepository sessionRepository, 
        IStudentBillingRepository billingRepository,
        IPublisher publisher)
    {
        _sessionRepository = sessionRepository;
        _billingRepository = billingRepository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(ProcessBankingCallbackCommand request, CancellationToken cancellationToken)
    {
        var session = await _sessionRepository.GetBySessionIdAsync(request.SessionId, cancellationToken);

        if (session == null)
            return Result<bool>.Failure(new Error("PaymentSession.NotFound", "Session not found."));

        if (!string.Equals(request.BankStatus, "SUCCESS", StringComparison.OrdinalIgnoreCase) && 
            !string.Equals(request.BankStatus, "PAID", StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(request.BankStatus, "COMPLETED", StringComparison.OrdinalIgnoreCase))
        {
            session.MarkFailed($"Bank callback status: {request.BankStatus}");
            await _sessionRepository.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }

        if (request.AmountPaid > 0 && request.AmountPaid < session.Amount)
        {
            return Result<bool>.Failure(new Error("PaymentSession.PartialPayment", "Partial payments via QR Ph / Gateway are not accepted for this transaction."));
        }

        var confirmResult = session.ConfirmPayment(request.BankReference);
        
        if (confirmResult.IsFailure)
        {
            // If already paid (duplicate callback), we return success to ack the webhook idempotently
            if (confirmResult.Error.Code == "PaymentSession.DuplicateConfirmation" || confirmResult.Error.Code == "PaymentSession.AlreadyPaid")
                return Result<bool>.Success(true);
                
            return confirmResult;
        }

        // Update associated StudentBilling / Tuition Invoice
        Guid applicantGuid = Guid.TryParse(session.ApplicantId, out var parsedGuid)
            ? parsedGuid
            : Guid.Empty;

        Domain.Aggregates.StudentBilling? billing = null;
        if (applicantGuid != Guid.Empty)
        {
            billing = await _billingRepository.GetByStudentIdAsync(applicantGuid, cancellationToken);
        }

        if (billing == null && !string.IsNullOrWhiteSpace(session.InvoiceId))
        {
            var rawInvoiceId = session.InvoiceId.Replace("INV-", "");
            if (Guid.TryParse(rawInvoiceId, out var invoiceGuid))
            {
                billing = await _billingRepository.GetByIdAsync(invoiceGuid, cancellationToken);
            }
        }

        if (billing != null)
        {
            billing.RecordPayment(session.Amount);
            await _billingRepository.UpdateAsync(billing, cancellationToken);
        }

        await _sessionRepository.SaveChangesAsync(cancellationToken);

        // Publish event to inform Admissions/Registrar that payment was verified
        await _publisher.Publish(new PaymentVerifiedIntegrationEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            session.ApplicantId,
            session.InvoiceId,
            session.Amount,
            session.Currency,
            session.SessionId,
            DateTime.UtcNow
        ), cancellationToken);

        return Result<bool>.Success(true);
    }
}
