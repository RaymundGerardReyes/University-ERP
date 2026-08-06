namespace Finance.Application.Features.AssessTuition;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AssessTuitionCommand(Guid StudentId, decimal Amount) : IRequest<Result<bool>>;

public sealed class AssessTuitionCommandHandler : IRequestHandler<AssessTuitionCommand, Result<bool>>
{
    private readonly IStudentBillingRepository _repository;

    public AssessTuitionCommandHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(AssessTuitionCommand request, CancellationToken cancellationToken)
    {
        var billing = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        if (billing == null)
            return Result<bool>.Failure(new Error("Finance.NotFound", "Billing record not found for student."));

        var result = billing.AssessTuition(request.Amount);
        if (result.IsFailure)
            return result;

        await _repository.UpdateAsync(billing, cancellationToken);
        return Result<bool>.Success(true);
    }
}
