namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record PaymentSessionDto(string SessionId, string InvoiceId, string ApplicantId, decimal Amount, string Purpose, string Currency, DateTime ExpiresAtUtc);

public sealed record ValidatePaymentSessionQuery(string SessionId) : IRequest<Result<PaymentSessionDto>>;

public sealed class ValidatePaymentSessionQueryHandler : IRequestHandler<ValidatePaymentSessionQuery, Result<PaymentSessionDto>>
{
    private readonly IPaymentSessionRepository _repository;

    public ValidatePaymentSessionQueryHandler(IPaymentSessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PaymentSessionDto>> Handle(ValidatePaymentSessionQuery request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetBySessionIdAsync(request.SessionId, cancellationToken);

        if (session == null)
            return Result<PaymentSessionDto>.Failure(new Error("PaymentSession.NotFound", "Invalid or unrecognized payment session."));

        if (session.Status != "Active" || DateTime.UtcNow > session.ExpiresAtUtc)
            return Result<PaymentSessionDto>.Failure(new Error("PaymentSession.Expired", "This payment session is expired or already consumed."));

        var dto = new PaymentSessionDto(
            session.SessionId,
            session.InvoiceId,
            session.ApplicantId,
            session.Amount,
            session.Purpose,
            session.Currency,
            session.ExpiresAtUtc
        );

        return Result<PaymentSessionDto>.Success(dto);
    }
}
