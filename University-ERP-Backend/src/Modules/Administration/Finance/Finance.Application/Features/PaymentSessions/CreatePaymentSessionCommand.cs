namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Domain.Aggregates;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record CreatePaymentSessionResponse(string SessionId, string CheckoutUrl);

public sealed record CreatePaymentSessionCommand(string InvoiceId, string ApplicantId, decimal Amount, string Purpose) : IRequest<Result<CreatePaymentSessionResponse>>;

public sealed class CreatePaymentSessionCommandHandler : IRequestHandler<CreatePaymentSessionCommand, Result<CreatePaymentSessionResponse>>
{
    private readonly IPaymentSessionRepository _repository;
    private readonly IPaymentGatewayService _gatewayService;
    private readonly Microsoft.Extensions.Options.IOptions<PaymentGatewayOptions> _options;

    public CreatePaymentSessionCommandHandler(IPaymentSessionRepository repository, IPaymentGatewayService gatewayService, Microsoft.Extensions.Options.IOptions<PaymentGatewayOptions> options)
    {
        _repository = repository;
        _gatewayService = gatewayService;
        _options = options;
    }

    public async Task<Result<CreatePaymentSessionResponse>> Handle(CreatePaymentSessionCommand request, CancellationToken cancellationToken)
    {
        var sessionResult = PaymentSession.Create(request.InvoiceId, request.ApplicantId, request.Amount, request.Purpose);

        if (sessionResult.IsFailure)
        {
            return Result<CreatePaymentSessionResponse>.Failure(sessionResult.Error);
        }

        var session = sessionResult.Value;

        var successUrl = _options.Value.SuccessUrl;
        var cancelUrl = _options.Value.CancelUrl;

        var checkoutResult = await _gatewayService.CreateCheckoutSessionAsync(session.SessionId, session.Amount, session.Currency, successUrl, cancelUrl, cancellationToken);
        
        if (checkoutResult.IsFailure)
        {
            return Result<CreatePaymentSessionResponse>.Failure(checkoutResult.Error);
        }

        // Advance state to indicate it has been forwarded to the gateway
        var initResult = session.InitiatePayment(System.Guid.NewGuid().ToString(), "checkout_session_created");
        if (initResult.IsFailure)
        {
            return Result<CreatePaymentSessionResponse>.Failure(initResult.Error);
        }

        await _repository.AddAsync(session, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return Result<CreatePaymentSessionResponse>.Success(new CreatePaymentSessionResponse(session.SessionId, checkoutResult.Value));
    }
}
