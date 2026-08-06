namespace Finance.Application.Features.ProcessPayment;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ProcessPaymentCommand(Guid StudentId, decimal Amount) : IRequest<Result<bool>>;

public sealed class ProcessPaymentCommandHandler : IRequestHandler<ProcessPaymentCommand, Result<bool>>
{
    private readonly IStudentBillingRepository _repository;

    public ProcessPaymentCommandHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(ProcessPaymentCommand request, CancellationToken cancellationToken)
    {
        var billing = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        if (billing == null)
            return Result<bool>.Failure(new Error("Finance.NotFound", "Billing record not found for student."));

        var result = billing.ProcessPayment(request.Amount);
        if (result.IsFailure)
            return result;

        await _repository.UpdateAsync(billing, cancellationToken);
        return Result<bool>.Success(true);
    }
}
