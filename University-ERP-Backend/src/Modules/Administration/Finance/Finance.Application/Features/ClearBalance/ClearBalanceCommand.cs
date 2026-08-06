namespace Finance.Application.Features.ClearBalance;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ClearBalanceCommand(Guid StudentId) : IRequest<Result<bool>>;

public sealed class ClearBalanceCommandHandler : IRequestHandler<ClearBalanceCommand, Result<bool>>
{
    private readonly IStudentBillingRepository _repository;

    public ClearBalanceCommandHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(ClearBalanceCommand request, CancellationToken cancellationToken)
    {
        var billing = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        if (billing == null)
            return Result<bool>.Failure(new Error("Finance.NotFound", "Billing record not found for student."));

        var result = billing.ClearBalance();
        if (result.IsFailure)
            return result;

        await _repository.UpdateAsync(billing, cancellationToken);
        return Result<bool>.Success(true);
    }
}
