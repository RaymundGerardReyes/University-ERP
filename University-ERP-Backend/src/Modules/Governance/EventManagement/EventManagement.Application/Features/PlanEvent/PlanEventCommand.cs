namespace EventManagement.Application.Features.PlanEvent;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using EventManagement.Domain.Aggregates;
using EventManagement.Application.Abstractions;

public sealed record PlanEventCommand(string EventName, string OrganizerId, string Venue, DateTime ScheduledDate, int MaxCapacity) : IRequest<Result<Guid>>;

public sealed class PlanEventCommandHandler : IRequestHandler<PlanEventCommand, Result<Guid>>
{
    private readonly IEventRepository _repository;

    public PlanEventCommandHandler(IEventRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(PlanEventCommand request, CancellationToken cancellationToken)
    {
        var eventResult = CampusEvent.Plan(
            request.EventName, 
            request.OrganizerId, 
            request.Venue, 
            request.ScheduledDate, 
            request.MaxCapacity);

        if (eventResult.IsFailure)
        {
            return Result<Guid>.Failure(eventResult.Error);
        }

        await _repository.AddAsync(eventResult.Value, cancellationToken);
        return Result<Guid>.Success(eventResult.Value.Id);
    }
}
