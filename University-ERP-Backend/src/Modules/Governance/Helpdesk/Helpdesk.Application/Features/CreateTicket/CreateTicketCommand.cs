namespace Helpdesk.Application.Features.CreateTicket;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using Helpdesk.Domain.Aggregates;
using Helpdesk.Application.Abstractions;

public sealed record CreateTicketCommand(string RequesterId, string Category, string IssueDescription, string Priority) : IRequest<Result<Guid>>;

public sealed class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, Result<Guid>>
{
    private readonly IHelpdeskRepository _repository;

    public CreateTicketCommandHandler(IHelpdeskRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {
        // 1. Invoke Domain Factory
        var ticketResult = ServiceTicket.Create(
            request.RequesterId, 
            request.Category, 
            request.IssueDescription, 
            request.Priority);

        // 2. Validate
        if (ticketResult.IsFailure)
        {
            return Result<Guid>.Failure(ticketResult.Error);
        }

        // 3. Persist via DI abstraction
        await _repository.AddAsync(ticketResult.Value, cancellationToken);

        // 4. Return success
        return Result<Guid>.Success(ticketResult.Value.Id);
    }
}
