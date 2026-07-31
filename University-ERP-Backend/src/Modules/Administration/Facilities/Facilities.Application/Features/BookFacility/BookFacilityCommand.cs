namespace Facilities.Application.Features.BookFacility;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record BookFacilityCommand(string RoomName, string ReservedBy, DateTime StartTime, DateTime EndTime) : IRequest<Result<Guid>>;

public sealed class BookFacilityCommandHandler : IRequestHandler<BookFacilityCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(BookFacilityCommand request, CancellationToken cancellationToken)
    {
        var reservationId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(reservationId));
    }
}
