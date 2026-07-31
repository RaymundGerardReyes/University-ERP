namespace MessCanteen.Application.Features.ReserveMeal;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ReserveMealCommand(Guid StudentId, Guid MealPlanId, DateTime ReservationDate) : IRequest<Result<Guid>>;

public sealed class ReserveMealCommandHandler : IRequestHandler<ReserveMealCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(ReserveMealCommand request, CancellationToken cancellationToken)
    {
        var reservationId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(reservationId));
    }
}
