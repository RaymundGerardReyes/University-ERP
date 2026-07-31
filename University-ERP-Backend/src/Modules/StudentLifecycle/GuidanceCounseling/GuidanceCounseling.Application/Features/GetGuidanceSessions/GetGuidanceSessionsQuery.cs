using MediatR;

namespace GuidanceCounseling.Application.Features.GetGuidanceSessions;

public sealed record CounselingSessionDto(
    string Id,
    string CounselorName,
    string SessionType,
    string Date,
    string Time,
    string? MeetingLink
);

public sealed record GetGuidanceSessionsQuery(string StudentId) : IRequest<IReadOnlyList<CounselingSessionDto>>;

public sealed class GetGuidanceSessionsQueryHandler : IRequestHandler<GetGuidanceSessionsQuery, IReadOnlyList<CounselingSessionDto>>
{
    public Task<IReadOnlyList<CounselingSessionDto>> Handle(GetGuidanceSessionsQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<CounselingSessionDto> mockSessions = new List<CounselingSessionDto>
        {
            new("GC-101", "Dr. Emily Vance", "Academic & Career", "2026-08-10", "11:00 AM", "https://meet.university.edu/gc-101")
        };

        return Task.FromResult(mockSessions);
    }
}
