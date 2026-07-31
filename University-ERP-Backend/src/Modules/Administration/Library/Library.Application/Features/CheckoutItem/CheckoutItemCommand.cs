namespace Library.Application.Features.CheckoutItem;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record CheckoutItemCommand(Guid CatalogItemId, Guid BorrowerId) : IRequest<Result<bool>>;

public sealed class CheckoutItemCommandHandler : IRequestHandler<CheckoutItemCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(CheckoutItemCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}
