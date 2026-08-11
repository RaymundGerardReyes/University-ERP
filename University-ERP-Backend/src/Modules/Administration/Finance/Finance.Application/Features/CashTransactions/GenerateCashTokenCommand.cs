namespace Finance.Application.Features.CashTransactions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Domain.Aggregates;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record GenerateCashTokenCommand(string ReferenceId, decimal Amount) : IRequest<Result<string>>;

public sealed class GenerateCashTokenCommandHandler : IRequestHandler<GenerateCashTokenCommand, Result<string>>
{
    private readonly ICashTransactionRepository _repository;

    public GenerateCashTokenCommandHandler(ICashTransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<string>> Handle(GenerateCashTokenCommand request, CancellationToken cancellationToken)
    {
        var transactionResult = CashTransaction.Create(request.ReferenceId, request.Amount);

        if (transactionResult.IsFailure)
        {
            return Result<string>.Failure(transactionResult.Error);
        }

        await _repository.AddAsync(transactionResult.Value, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(transactionResult.Value.TransactionToken);
    }
}