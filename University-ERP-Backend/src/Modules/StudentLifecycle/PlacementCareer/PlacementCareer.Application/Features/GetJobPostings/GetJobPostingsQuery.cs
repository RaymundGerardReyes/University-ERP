using MediatR;

namespace PlacementCareer.Application.Features.GetJobPostings;

public sealed record JobPostingDto(
    string Id,
    string JobTitle,
    string CompanyName,
    string Location,
    IReadOnlyList<string> Tags,
    DateTime Deadline
);

public sealed record GetJobPostingsQuery() : IRequest<IReadOnlyList<JobPostingDto>>;

public sealed class GetJobPostingsQueryHandler : IRequestHandler<GetJobPostingsQuery, IReadOnlyList<JobPostingDto>>
{
    public Task<IReadOnlyList<JobPostingDto>> Handle(GetJobPostingsQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<JobPostingDto> mockJobs = new List<JobPostingDto>
        {
            new("JOB-301", "Graduate Software Engineer", "Nexus Tech Corp", "San Francisco, CA / Remote", new List<string> { "Full-Time", "React", ".NET Core" }, DateTime.UtcNow.AddDays(15)),
            new("JOB-302", "Data Analyst Intern", "Quantum Dynamics", "New York, NY", new List<string> { "Internship", "SQL", "Python" }, DateTime.UtcNow.AddDays(30))
        };

        return Task.FromResult(mockJobs);
    }
}
