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
    private readonly IPublisher _publisher;

    public ProcessBankingCallbackCommandHandler(
        IPaymentSessionRepository sessionRepository, 
        IPublisher publisher)
    {
        _sessionRepository = sessionRepository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(ProcessBankingCallbackCommand request, CancellationToken cancellationToken)
    {
        var session = await _sessionRepository.GetBySessionIdAsync(request.SessionId, cancellationToken);

        if (session == null)
            return Result<bool>.Failure(new Error("PaymentSession.NotFound", "Session not found."));

        if (request.BankStatus != "SUCCESS")
        {
            // For now, just ignore failed callbacks (or transition session to Failed in domain later)
            return Result<bool>.Success(true);
        }

        if (request.AmountPaid < session.Amount)
        {
            return Result<bool>.Failure(new Error("PaymentSession.PartialPayment", "Partial payments via QR Ph are not accepted for this transaction."));
        }

        var confirmResult = session.ConfirmPayment(request.BankReference);
        
        if (confirmResult.IsFailure)
        {
            // If already paid (duplicate callback), we return success to ack the webhook idempotently
            if (confirmResult.Error.Code == "PaymentSession.DuplicateConfirmation")
                return Result<bool>.Success(true);
                
            return confirmResult;
        }

        await _sessionRepository.SaveChangesAsync(cancellationToken);

        // Publish event to inform Admissions/Registrar that payment was verified
        await _publisher.Publish(new PaymentVerifiedIntegrationEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            Guid.Parse(session.ApplicantId),
            session.InvoiceId,
            session.Amount,
            session.Currency,
            session.SessionId,
            DateTime.UtcNow
        ), cancellationToken);

        return Result<bool>.Success(true);
    }
}
