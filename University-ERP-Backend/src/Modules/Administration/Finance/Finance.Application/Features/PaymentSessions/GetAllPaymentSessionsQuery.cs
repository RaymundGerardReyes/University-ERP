namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed record PaymentSessionRecordDto(
    string SessionId,
    string InvoiceId,
    string ApplicantId,
    decimal Amount,
    string Currency,
    string Status,
    string? BankReference,
    System.DateTime CreatedAtUtc,
    System.DateTime? ConsumedAtUtc
);

public sealed record GetAllPaymentSessionsQuery() : IRequest<Result<IReadOnlyList<PaymentSessionRecordDto>>>;

public sealed class GetAllPaymentSessionsQueryHandler : IRequestHandler<GetAllPaymentSessionsQuery, Result<IReadOnlyList<PaymentSessionRecordDto>>>
{
    private readonly IPaymentSessionRepository _repository;

    public GetAllPaymentSessionsQueryHandler(IPaymentSessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IReadOnlyList<PaymentSessionRecordDto>>> Handle(GetAllPaymentSessionsQuery request, CancellationToken cancellationToken)
    {
        var sessions = await _repository.GetAllAsync(cancellationToken);

        var dtos = sessions.ConvertAll(s => new PaymentSessionRecordDto(
            s.SessionId,
            s.InvoiceId,
            s.ApplicantId,
            s.Amount,
            s.Currency,
            s.Status,
            s.BankReference,
            s.CreatedAtUtc,
            s.ConsumedAtUtc
        ));

        return Result<IReadOnlyList<PaymentSessionRecordDto>>.Success(dtos);
    }
}
