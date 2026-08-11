namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using Contracts.IntegrationEvents.Administration;
using System.Threading;
using System.Threading.Tasks;
using System;

public sealed record CompletePaymentSessionCommand(string SessionId, string PaymentToken = "tok_mock_123") : IRequest<Result<bool>>;

public sealed class CompletePaymentSessionCommandHandler : IRequestHandler<CompletePaymentSessionCommand, Result<bool>>
{
    private readonly IPaymentSessionRepository _sessionRepository;
    private readonly IPublisher _publisher;
    private readonly IPaymentGatewayService _paymentGateway;

    public CompletePaymentSessionCommandHandler(
        IPaymentSessionRepository sessionRepository, 
        IPublisher publisher,
        IPaymentGatewayService paymentGateway)
    {
        _sessionRepository = sessionRepository;
        _publisher = publisher;
        _paymentGateway = paymentGateway;
    }

    public async Task<Result<bool>> Handle(CompletePaymentSessionCommand request, CancellationToken cancellationToken)
    {
        var session = await _sessionRepository.GetBySessionIdAsync(request.SessionId, cancellationToken);

        if (session == null)
            return Result<bool>.Failure(new Error("PaymentSession.NotFound", "Session not found."));

        // Process the payment through the external gateway
        var gatewayResult = await _paymentGateway.ProcessChargeAsync(request.PaymentToken, session.Amount, session.Currency, cancellationToken);
        
        if (gatewayResult.IsFailure)
        {
            return Result<bool>.Failure(new Error("Finance.PaymentFailed", $"Payment processing failed: {gatewayResult.Error.Description}"));
        }

        // The gateway returns a successful Transaction ID, which we map back (conceptually)
        // string transactionId = gatewayResult.Value;

        var completeResult = session.Complete();

        if (completeResult.IsFailure)
            return completeResult;

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
