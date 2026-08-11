namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using System;

public sealed record GenerateDynamicQRCommand(string SessionId) : IRequest<Result<string>>;

public sealed class GenerateDynamicQRCommandHandler : IRequestHandler<GenerateDynamicQRCommand, Result<string>>
{
    private readonly IPaymentSessionRepository _sessionRepository;

    private readonly IPaymentGatewayService _gatewayService;

    public GenerateDynamicQRCommandHandler(IPaymentSessionRepository sessionRepository, IPaymentGatewayService gatewayService)
    {
        _sessionRepository = sessionRepository;
        _gatewayService = gatewayService;
    }

    public async Task<Result<string>> Handle(GenerateDynamicQRCommand request, CancellationToken cancellationToken)
    {
        var session = await _sessionRepository.GetBySessionIdAsync(request.SessionId, cancellationToken);

        if (session == null)
        {
            return Result<string>.Failure(new Error("PaymentSession.NotFound", "Session not found."));
        }

        if (session.Status != "AwaitingPayment" && session.Status != "PendingBankConfirmation")
        {
            return Result<string>.Failure(new Error("PaymentSession.InvalidState", "Only pending sessions can generate QR codes."));
        }

        // Generate an idempotency key if not already set (for UI refreshes)
        if (session.Status == "AwaitingPayment")
        {
            var initResult = session.InitiatePayment(Guid.NewGuid().ToString(), "gateway_txn_pending");
            if (initResult.IsFailure) return Result<string>.Failure(initResult.Error);
            
            await _sessionRepository.SaveChangesAsync(cancellationToken);
        }

        // Ask the bank for the actual, valid QR Ph payload
        var instrumentResult = await _gatewayService.GeneratePaymentInstrumentAsync(session.SessionId, session.Amount, session.Currency, cancellationToken);
        
        if (instrumentResult.IsFailure)
        {
            return Result<string>.Failure(instrumentResult.Error);
        }

        return Result<string>.Success(instrumentResult.Value);
    }
}
