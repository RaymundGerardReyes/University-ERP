namespace Finance.Application.Features.StudentBilling.AdjustTuition;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AdjustTuitionCommand(string StudentId, decimal AdjustmentAmount, string Reason) : IRequest<Result<bool>>;

public sealed class AdjustTuitionCommandHandler : IRequestHandler<AdjustTuitionCommand, Result<bool>>
{
    private readonly IStudentBillingRepository _billingRepository;

    public AdjustTuitionCommandHandler(IStudentBillingRepository billingRepository)
    {
        _billingRepository = billingRepository;
    }

    public async Task<Result<bool>> Handle(AdjustTuitionCommand request, CancellationToken cancellationToken)
    {
        // 1. Safely parse the incoming Student ID
        if (!Guid.TryParse(request.StudentId, out Guid studentGuid))
        {
            // Fallback to empty GUID for development mock strings (e.g., "demo")
            studentGuid = Guid.Empty;
        }

        // 2. Fetch the dynamic billing record directly from PostgreSQL
        var billingRecord = await _billingRepository.GetByStudentIdAsync(studentGuid, cancellationToken);
        
        if (billingRecord == null)
        {
            return Result<bool>.Failure(new Error("Finance.NotFound", "No active billing record found for this student."));
        }

        // 3. Delegate the reassessment to the Domain Aggregate
        var result = billingRecord.AdjustTuition(request.AdjustmentAmount, request.Reason);
        
        if (result.IsSuccess)
        {
            // 4. Persist the updated ledger back to the database
            await _billingRepository.UpdateAsync(billingRecord, cancellationToken);
        }

        return result;
    }
}
