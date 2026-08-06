namespace Finance.Application.Features.GetInvoices;

using MediatR;
using SharedKernel.Domain.Primitives;
using System.Collections.Generic;

public record GetInvoicesQuery : IRequest<Result<IReadOnlyList<InvoiceDto>>>;

public record InvoiceDto(string Id, string StudentId, decimal Amount, decimal PaidAmount, string Description, string Status, System.DateTime IssuedOnUtc);
