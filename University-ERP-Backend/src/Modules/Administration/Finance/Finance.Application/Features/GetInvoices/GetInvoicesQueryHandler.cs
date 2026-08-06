namespace Finance.Application.Features.GetInvoices;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class GetInvoicesQueryHandler : IRequestHandler<GetInvoicesQuery, Result<IReadOnlyList<InvoiceDto>>>
{
    private readonly IStudentBillingRepository _repository;

    public GetInvoicesQueryHandler(IStudentBillingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IReadOnlyList<InvoiceDto>>> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
    {
        var billings = await _repository.GetAllAsync(cancellationToken);

        var dtos = billings.Select(b => new InvoiceDto(
            b.Id.ToString(),
            b.StudentId.ToString(),
            b.TotalAmount,
            b.PaidAmount,
            b.Description,
            b.Status,
            b.IssuedOnUtc
        )).ToList().AsReadOnly();

        return Result<IReadOnlyList<InvoiceDto>>.Success(dtos);
    }
}
