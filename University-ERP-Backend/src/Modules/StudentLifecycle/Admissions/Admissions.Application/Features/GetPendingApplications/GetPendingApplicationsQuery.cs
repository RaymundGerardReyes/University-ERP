namespace Admissions.Application.Features.GetPendingApplications;

using MediatR;
using Admissions.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. Add the Document DTO
public sealed record PendingAppDocumentDto(
    string Id,
    string Name,
    string Status,
    DateTime? UploadedAt,
    string? FilePath
);

// 1. DTO matching the frontend 'PendingApplication' interface
public sealed record PendingApplicationDto(
    string Id, 
    string ApplicantName, 
    string Program, 
    string Department, 
    string Status, 
    double Gpa, 
    string SubmittedDate,
    string? InterviewDate, 
    string? InterviewTime,
    string ApplicationFeeStatus,
    List<PendingAppDocumentDto> Documents // NEW
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
            .Where(a => a.Status == "InterviewPending" || a.Status == "Under Review" || a.Status == "Pending Faculty Approval" || a.Status == "Submitted")
            .ToList();

        var result = new List<PendingApplicationDto>();

        foreach (var app in pendingApps)
        {
            var program = await _programRepository.GetByIdAsync(app.ProgramId, cancellationToken);
            
            var programName = program != null && !string.IsNullOrWhiteSpace(program.Major)
                ? $"{program.Degree} {program.Major}".Trim()
                : app.ProgramId switch
                {
                    "BSCS" => "B.S. Computer Science",
                    "BSCE" => "B.S. Civil Engineering",
                    "BBA" => "B.S. Business Administration",
                    _ => string.IsNullOrWhiteSpace(app.ProgramId) ? "B.S. Computer Science" : app.ProgramId
                };

            var collegeName = program?.College ?? "College of Computer Studies";

            // Apply optional department filter
            if (!string.IsNullOrEmpty(request.Department) && request.Department != "All" && collegeName != request.Department)
            {
                continue;
            }

            var applicantDisplayName = app.ApplicantId.Length >= 8 
                ? $"Applicant ({app.ApplicantId.Substring(0, 8)}...)" 
                : $"Applicant ({app.ApplicantId})";

            // 3. Map the documents
            var documents = app.Documents.Select(d => new PendingAppDocumentDto(
                d.Id,
                d.Name,
                d.Status,
                d.UploadedAt,
                d.FilePath
            )).ToList();

            result.Add(new PendingApplicationDto(
                app.Id,
                applicantDisplayName,
                programName,
                collegeName,
                app.Status,
                3.85,
                app.SubmittedDate.ToString("yyyy-MM-dd"),
                string.IsNullOrWhiteSpace(app.InterviewDate) ? null : app.InterviewDate,
                string.IsNullOrWhiteSpace(app.InterviewTime) ? null : app.InterviewTime,
                app.ApplicationFeeStatus,
                documents // NEW
            ));
        }

        return result;
    }
}