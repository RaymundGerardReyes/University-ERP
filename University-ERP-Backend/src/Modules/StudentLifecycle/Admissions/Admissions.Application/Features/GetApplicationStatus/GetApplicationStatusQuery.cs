using MediatR;

namespace Admissions.Application.Features.GetApplicationStatus;

public sealed record ApplicationStatusDto(
    string Id,
    string ProgramName,
    string Status,
    DateTime SubmittedDate
);

public sealed record GetApplicationStatusQuery(string StudentId) : IRequest<IReadOnlyList<ApplicationStatusDto>>;

public sealed class GetApplicationStatusQueryHandler : IRequestHandler<GetApplicationStatusQuery, IReadOnlyList<ApplicationStatusDto>>
{
    public Task<IReadOnlyList<ApplicationStatusDto>> Handle(GetApplicationStatusQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<ApplicationStatusDto> mockApplications = new List<ApplicationStatusDto>
        {
            new("APP-2026-0891", "B.S. Computer Science & Engineering", "Enrolled", DateTime.UtcNow.AddMonths(-6)),
            new("APP-2025-0102", "B.S. Information Technology", "Accepted", DateTime.UtcNow.AddYears(-1))
        };

        return Task.FromResult(mockApplications);
    }
}
