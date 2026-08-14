namespace Finance.Application.Features.StudentBilling.GetStudentBillings;

using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;

public sealed record StudentBillingDto(
    Guid Id,
    Guid StudentId,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal OutstandingBalance,
    string Description,
    string Status,
    DateTime IssuedOnUtc
);

public sealed record GetAllStudentBillingsQuery() : IRequest<IReadOnlyList<StudentBillingDto>>;

public sealed class GetAllStudentBillingsQueryHandler : IRequestHandler<GetAllStudentBillingsQuery, IReadOnlyList<StudentBillingDto>>
{
    private readonly IStudentBillingRepository _repository;

    public GetAllStudentBillingsQueryHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<StudentBillingDto>> Handle(GetAllStudentBillingsQuery request, CancellationToken cancellationToken)
    {
        var billings = await _repository.GetAllAsync(cancellationToken);

        // Dynamically map the database entities to the DTO
        return billings.Select(b => new StudentBillingDto(
            b.Id,
            b.StudentId,
            b.TotalAmount,
            b.PaidAmount,
            b.TotalAmount - b.PaidAmount, // Calculate dynamic outstanding balance
            b.Description,
            b.Status,
            b.IssuedOnUtc
        )).OrderByDescending(b => b.IssuedOnUtc).ToList();
    }
}
