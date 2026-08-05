namespace Inventory.Application.Features.AdjustStock;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AdjustStockCommand(Guid StockItemId, int Amount, string Reason) : IRequest<Result<Guid>>;

public sealed class AdjustStockCommandHandler : IRequestHandler<AdjustStockCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<Guid>.Success(request.StockItemId));
    }
}
