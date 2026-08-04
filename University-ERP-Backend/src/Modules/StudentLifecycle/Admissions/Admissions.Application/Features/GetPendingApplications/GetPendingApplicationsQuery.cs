namespace Admissions.Application.Features.GetPendingApplications;

using MediatR;
using Admissions.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO matching the frontend 'PendingApplication' interface
public sealed record PendingApplicationDto(
    string Id, 
    string ApplicantName, 
    string Program, 
    string Department, 
    string Status, 
    double Gpa, 
    string SubmittedDate
);

// 2. The MediatR Query
public sealed record GetPendingApplicationsQuery(string? Department) : IRequest<IReadOnlyList<PendingApplicationDto>>;

// 3. The Handler
public sealed class GetPendingApplicationsQueryHandler : IRequestHandler<GetPendingApplicationsQuery, IReadOnlyList<PendingApplicationDto>>
{
    private readonly IAdmissionApplicationRepository _repository;
    private readonly IProgramOfferingRepository _programRepository;

    public GetPendingApplicationsQueryHandler(
        IAdmissionApplicationRepository repository, 
        IProgramOfferingRepository programRepository)
    {
        _repository = repository;
        _programRepository = programRepository;
    }

    public async Task<IReadOnlyList<PendingApplicationDto>> Handle(GetPendingApplicationsQuery request, CancellationToken cancellationToken)
    {
        // In a real DB scenario, we would add a specific repository method to fetch by status.
        // For now, we fetch all and filter for demonstration of the DBMA pattern.
        var allApplications = await _repository.GetAllAsync(cancellationToken); 
        
        var pendingApps = allApplications
            .Where(a => a.Status == "Under Review" || a.Status == "Pending Faculty Approval")
            .ToList();

        var result = new List<PendingApplicationDto>();

        foreach (var app in pendingApps)
        {
            var program = await _programRepository.GetByIdAsync(app.ProgramId, cancellationToken);
            
            // Apply optional department filter
            if (!string.IsNullOrEmpty(request.Department) && request.Department != "All" && program?.College != request.Department)
            {
                continue;
            }

            result.Add(new PendingApplicationDto(
                app.Id,
                "Applicant Data", // Requires integration with Identity module via UserId
                program?.Degree + " " + program?.Major ?? "Unknown Program",
                program?.College ?? "Unknown",
                app.Status,
                3.5, // Requires integration with academic history
                app.SubmittedDate.ToString("yyyy-MM-dd")
            ));
        }

        return result;
    }
}