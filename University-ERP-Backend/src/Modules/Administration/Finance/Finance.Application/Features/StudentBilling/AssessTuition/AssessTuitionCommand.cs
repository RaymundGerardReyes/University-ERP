namespace Finance.Application.Features.StudentBilling.AssessTuition;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AssessTuitionCommand(string StudentId, string TermId) : IRequest<Result<Guid>>;

public sealed class AssessTuitionCommandHandler : IRequestHandler<AssessTuitionCommand, Result<Guid>>
{
    private readonly IStudentBillingRepository _billingRepository;

    public AssessTuitionCommandHandler(IStudentBillingRepository billingRepository)
    {
        _billingRepository = billingRepository;
    }

    public async Task<Result<Guid>> Handle(AssessTuitionCommand request, CancellationToken cancellationToken)
    {
        decimal dynamicBaseTuition = 1500.00m; 
        decimal dynamicLabFees = 250.00m;
        decimal dynamicMiscFees = 150.00m;
        
        decimal totalAmount = dynamicBaseTuition + dynamicLabFees + dynamicMiscFees;

        if (!Guid.TryParse(request.StudentId, out Guid studentGuid))
        {
            studentGuid = Guid.NewGuid();
        }

        var billingResult = Finance.Domain.Aggregates.StudentBilling.IssueInvoice(
            studentGuid,
            totalAmount,
            $"Tuition Assessment for {request.TermId}"
        );

        if (!billingResult.IsSuccess)
        {
            return Result<Guid>.Failure(billingResult.Error);
        }

        var billing = billingResult.Value;
        await _billingRepository.AddAsync(billing, cancellationToken);

        return Result<Guid>.Success(billing.Id);
    }
}
