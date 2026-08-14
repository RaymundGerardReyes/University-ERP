namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using Contracts.IntegrationEvents.Administration;
using System.Threading;
using System.Threading.Tasks;
using System;

// The CQRS Command mapped to POST /api/v1/finance/payment-sessions/{sessionId}/reconcile
public sealed record ReconcilePaymentSessionCommand(string SessionId, string CashierId, string Remarks) : IRequest<Result<bool>>;

public sealed class ReconcilePaymentSessionCommandHandler : IRequestHandler<ReconcilePaymentSessionCommand, Result<bool>>
{
    private readonly IPaymentSessionRepository _sessionRepository;
    private readonly IStudentBillingRepository _billingRepository;
    private readonly IPublisher _publisher;

    public ReconcilePaymentSessionCommandHandler(
        IPaymentSessionRepository sessionRepository, 
        IStudentBillingRepository billingRepository,
        IPublisher publisher)
    {
        _sessionRepository = sessionRepository;
        _billingRepository = billingRepository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(ReconcilePaymentSessionCommand request, CancellationToken cancellationToken)
    {
        // 1. Retrieve the active Payment Session
        var session = await _sessionRepository.GetBySessionIdAsync(request.SessionId, cancellationToken);
        if (session == null) 
            return Result<bool>.Failure(new Error("Finance.SessionNotFound", "Payment session not found."));

        // 2. Reconcile the Session (marks it as Paid)
        var reconcileResult = session.Reconcile(request.CashierId, request.Remarks);
        if (reconcileResult.IsFailure) 
            return reconcileResult;

        // 3. Retrieve the associated Student Billing Invoice
        if (Guid.TryParse(session.InvoiceId, out Guid billingId))
        {
            var billing = await _billingRepository.GetByIdAsync(billingId, cancellationToken);
            if (billing != null)
            {
                // 4. Record the payment against the tuition invoice
                billing.RecordPayment(session.Amount);
                await _billingRepository.UpdateAsync(billing, cancellationToken);
            }
        }

        // 5. Persist the session changes
        await _sessionRepository.SaveChangesAsync(cancellationToken);
        
        string manualReference = $"MANUAL-REC-{request.CashierId}-{DateTime.UtcNow.Ticks}";

        // 6. Publish integration event to advance student admissions/fees workflow if applicable
        if (Guid.TryParse(session.ApplicantId, out Guid applicantGuid))
        {
            var integrationEvent = new PaymentVerifiedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                applicantGuid,
                session.InvoiceId,
                session.Amount,
                session.Currency,
                manualReference,
                DateTime.UtcNow
            );

            await _publisher.Publish(integrationEvent, cancellationToken);
        }

        return Result<bool>.Success(true);
    }
}
