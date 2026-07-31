namespace Transport.Application.Features.AssignRoute;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AssignRouteCommand(Guid RouteId, string DriverId) : IRequest<Result<bool>>;

public sealed class AssignRouteCommandHandler : IRequestHandler<AssignRouteCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(AssignRouteCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}
