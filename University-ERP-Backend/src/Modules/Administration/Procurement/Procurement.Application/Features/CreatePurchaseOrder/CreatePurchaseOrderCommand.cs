namespace Procurement.Application.Features.CreatePurchaseOrder;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record CreatePurchaseOrderCommand(string VendorId, decimal TotalAmount) : IRequest<Result<Guid>>;

public sealed class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var orderId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(orderId));
    }
}
