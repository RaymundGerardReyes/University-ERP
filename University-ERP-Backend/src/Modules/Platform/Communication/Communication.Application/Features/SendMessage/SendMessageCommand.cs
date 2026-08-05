namespace Communication.Application.Features.SendMessage;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Communication.Domain.Aggregates;
using Communication.Application.Abstractions;

public sealed record SendMessageCommand(string SenderId, string ReceiverId, string Content) : IRequest<Result<Guid>>;

public sealed class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, Result<Guid>>
{
    private readonly ICommunicationRepository _repository;

    public SendMessageCommandHandler(ICommunicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var messageResult = DirectMessage.Send(
            request.SenderId, 
            request.ReceiverId, 
            request.Content);

        if (messageResult.IsFailure)
        {
            return Result<Guid>.Failure(messageResult.Error);
        }

        await _repository.AddAsync(messageResult.Value, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(messageResult.Value.Id);
    }
}
