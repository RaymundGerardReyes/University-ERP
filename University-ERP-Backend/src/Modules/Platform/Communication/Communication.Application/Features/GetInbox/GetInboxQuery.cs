namespace Communication.Application.Features.GetInbox;

using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

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
    public Task<IReadOnlyList<InboxMessageDto>> Handle(GetInboxQuery request, CancellationToken cancellationToken)
    {
        var mockData = new List<InboxMessageDto>
        {
            new("MSG-01", "Dean of Engineering", "Curriculum Update 2026", DateTime.UtcNow.ToString("o"), false),
            new("MSG-02", "Alex Morgan (Student)", "Question regarding Midterm", DateTime.UtcNow.AddDays(-1).ToString("o"), true)
        };

        return Task.FromResult<IReadOnlyList<InboxMessageDto>>(mockData);
    }
}