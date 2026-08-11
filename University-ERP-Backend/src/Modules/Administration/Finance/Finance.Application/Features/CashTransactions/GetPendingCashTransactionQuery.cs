namespace Finance.Application.Features.CashTransactions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record CashTransactionDto(string TransactionToken, string ReferenceId, decimal Amount, string Status);

public sealed record GetPendingCashTransactionQuery(string Token) : IRequest<Result<CashTransactionDto>>;

public sealed class GetPendingCashTransactionQueryHandler : IRequestHandler<GetPendingCashTransactionQuery, Result<CashTransactionDto>>
{
    private readonly ICashTransactionRepository _repository;

    public GetPendingCashTransactionQueryHandler(ICashTransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<CashTransactionDto>> Handle(GetPendingCashTransactionQuery request, CancellationToken cancellationToken)
    {
        var transaction = await _repository.GetByTokenAsync(request.Token, cancellationToken);

        if (transaction == null)
        {
            return Result<CashTransactionDto>.Failure(new Error("CashTransaction.NotFound", "Transaction token not found."));
        }

        var dto = new CashTransactionDto(
            transaction.TransactionToken,
            transaction.ReferenceId,
            transaction.Amount,
            transaction.Status
        );

        return Result<CashTransactionDto>.Success(dto);
    }
}