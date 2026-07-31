using MediatR;

namespace Alumni.Application.Features.GetAlumniStatus;

public sealed record AlumniStatusDto(
    string StudentId,
    bool IsRegisteredAlumni,
    string GraduationClearanceStatus,
    int? GraduationYear,
    string? RegionalChapter,
    IReadOnlyList<string> ActiveBenefits
);

public sealed record GetAlumniStatusQuery(string StudentId) : IRequest<AlumniStatusDto>;

public sealed class GetAlumniStatusQueryHandler : IRequestHandler<GetAlumniStatusQuery, AlumniStatusDto>
{
    public Task<AlumniStatusDto> Handle(GetAlumniStatusQuery request, CancellationToken cancellationToken)
    {
        var mockStatus = new AlumniStatusDto(
            request.StudentId,
            true,
            "Cleared",
            2026,
            "North America Chapter",
            new List<string> { "Library Access", "Career Counseling", "Alumni Directory" }
        );

        return Task.FromResult(mockStatus);
    }
}
