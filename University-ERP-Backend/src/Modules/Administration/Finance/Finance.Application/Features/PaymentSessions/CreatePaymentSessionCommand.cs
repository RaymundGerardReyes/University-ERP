namespace Finance.Application.Features.PaymentSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Domain.Aggregates;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record CreatePaymentSessionCommand(string InvoiceId, string ApplicantId, decimal Amount, string Purpose) : IRequest<Result<string>>;

public sealed class CreatePaymentSessionCommandHandler : IRequestHandler<CreatePaymentSessionCommand, Result<string>>
{
    private readonly IPaymentSessionRepository _repository;

    public CreatePaymentSessionCommandHandler(IPaymentSessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<string>> Handle(CreatePaymentSessionCommand request, CancellationToken cancellationToken)
    {
        var sessionResult = PaymentSession.Create(request.InvoiceId, request.ApplicantId, request.Amount, request.Purpose);

        if (sessionResult.IsFailure)
        {
            return Result<string>.Failure(sessionResult.Error);
        }

        await _repository.AddAsync(sessionResult.Value, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(sessionResult.Value.SessionId);
    }
}
