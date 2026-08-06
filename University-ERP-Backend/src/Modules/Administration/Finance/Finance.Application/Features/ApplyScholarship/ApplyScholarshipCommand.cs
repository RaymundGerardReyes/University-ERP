namespace Finance.Application.Features.ApplyScholarship;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ApplyScholarshipCommand(Guid StudentId, decimal Deduction, string GrantType) : IRequest<Result<bool>>;

public sealed class ApplyScholarshipCommandHandler : IRequestHandler<ApplyScholarshipCommand, Result<bool>>
{
    private readonly IStudentBillingRepository _repository;

    public ApplyScholarshipCommandHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(ApplyScholarshipCommand request, CancellationToken cancellationToken)
    {
        var billing = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        if (billing == null)
            return Result<bool>.Failure(new Error("Finance.NotFound", "Billing record not found for student."));

        var result = billing.ApplyScholarship(request.Deduction, request.GrantType);
        if (result.IsFailure)
            return result;

        await _repository.UpdateAsync(billing, cancellationToken);
        return Result<bool>.Success(true);
    }
}
