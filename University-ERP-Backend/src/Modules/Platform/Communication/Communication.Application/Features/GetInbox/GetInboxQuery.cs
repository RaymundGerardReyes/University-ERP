namespace Communication.Application.Features.GetInbox;

using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Communication.Application.Abstractions;
public sealed record InboxMessageDto(
    string Id, 
    string Sender, 
    string Subject, 
    string Date, 
    bool IsRead
);

public sealed record GetInboxQuery(string FacultyId) : IRequest<IReadOnlyList<InboxMessageDto>>;

public sealed class GetInboxQueryHandler : IRequestHandler<GetInboxQuery, IReadOnlyList<InboxMessageDto>>
{
    private readonly ICommunicationRepository _repository;

    public GetInboxQueryHandler(ICommunicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<InboxMessageDto>> Handle(GetInboxQuery request, CancellationToken cancellationToken)
    {
        var messages = await _repository.GetByReceiverIdAsync(request.FacultyId, cancellationToken);
        
        var dtos = new List<InboxMessageDto>();
        foreach (var msg in messages)
        {
            var subject = msg.Content.Length > 50 ? msg.Content.Substring(0, 50) + "..." : msg.Content;
            dtos.Add(new InboxMessageDto(
                msg.Id.ToString(),
                msg.SenderId,
                subject,
                msg.SentOnUtc.ToString("o"),
                msg.IsRead
            ));
        }

        return dtos;
    }
}