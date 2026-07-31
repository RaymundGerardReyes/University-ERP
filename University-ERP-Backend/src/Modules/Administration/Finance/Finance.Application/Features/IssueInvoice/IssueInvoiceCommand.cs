namespace Finance.Application.Features.IssueInvoice;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Domain.Aggregates;
using Finance.Application.Abstractions;

public sealed record IssueInvoiceCommand(Guid StudentId, decimal Amount, string Description) : IRequest<Result<Guid>>;

public sealed class IssueInvoiceCommandHandler : IRequestHandler<IssueInvoiceCommand, Result<Guid>>
{
    private readonly IStudentBillingRepository _repository;

    public IssueInvoiceCommandHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(IssueInvoiceCommand request, CancellationToken cancellationToken)
    {
        // 1. Invoke the Domain Aggregate factory to validate business invariants
        var billingResult = StudentBilling.IssueInvoice(
            request.StudentId, 
            request.Amount, 
            request.Description);

        // 2. Return early if domain invariants are violated
        if (billingResult.IsFailure)
        {
            return Result<Guid>.Failure(billingResult.Error);
        }

        // 3. Persist the valid domain aggregate
        await _repository.AddAsync(billingResult.Value, cancellationToken);

        // 4. Return success with the new Aggregate ID
        return Result<Guid>.Success(billingResult.Value.Id);
    }
}
