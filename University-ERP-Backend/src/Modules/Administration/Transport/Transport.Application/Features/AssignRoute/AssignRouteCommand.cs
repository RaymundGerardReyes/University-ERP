namespace Transport.Application.Features.AssignRoute;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AssignRouteCommand(Guid RouteId, string DriverId) : IRequest<Result<Guid>>;

public sealed class AssignRouteCommandHandler : IRequestHandler<AssignRouteCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(AssignRouteCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<Guid>.Success(request.RouteId));
    }
}
