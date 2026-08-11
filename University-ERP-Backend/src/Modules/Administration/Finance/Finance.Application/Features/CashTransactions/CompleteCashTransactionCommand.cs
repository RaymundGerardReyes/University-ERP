namespace Finance.Application.Features.CashTransactions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record CompleteCashTransactionCommand(string Token) : IRequest<Result<bool>>;

public sealed class CompleteCashTransactionCommandHandler : IRequestHandler<CompleteCashTransactionCommand, Result<bool>>
{
    private readonly ICashTransactionRepository _repository;

    public CompleteCashTransactionCommandHandler(ICashTransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(CompleteCashTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _repository.GetByTokenAsync(request.Token, cancellationToken);

        if (transaction == null)
        {
            return Result<bool>.Failure(new Error("CashTransaction.NotFound", "Transaction token not found."));
        }

        var completeResult = transaction.Complete();

        if (completeResult.IsFailure)
        {
            return completeResult;
        }

        await _repository.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}