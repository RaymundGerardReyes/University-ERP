namespace Admissions.Application.Features.GetApplicantJourney;

using MediatR;
using Admissions.Application.Abstractions;
using Admissions.Application.Features.GetProgramCatalog;

public sealed record JourneyMilestoneDto(
    string Id,
    string Title,
    string Status,
    string Description,
    DateTime? DateCompleted
);

public sealed record ApplicantDocumentDto(
    string Id,
    string Name,
    string Status,
    DateTime? UploadedAt,
    string? Feedback
);

public sealed record TimelineEventDto(
    string Date,
    string Event,
    string Detail
);

public sealed record JourneyStateDto(
    string ApplicantName,
    string ApplicantId,
    int CurrentStage,
    List<JourneyMilestoneDto> Milestones,
    List<ProgramOfferingDto> Programs,
    List<ApplicantDocumentDto> Documents,
    List<TimelineEventDto> Timeline
);

public sealed record GetApplicantJourneyQuery(string StudentId) : IRequest<JourneyStateDto?>;

public sealed class GetApplicantJourneyQueryHandler : IRequestHandler<GetApplicantJourneyQuery, JourneyStateDto?>
{
    private readonly IAdmissionApplicationRepository _repository;
    private readonly IProgramOfferingRepository _programRepository;

    public GetApplicantJourneyQueryHandler(IAdmissionApplicationRepository repository, IProgramOfferingRepository programRepository)
    {
        _repository = repository;
        _programRepository = programRepository;
    }

    public async Task<JourneyStateDto?> Handle(GetApplicantJourneyQuery request, CancellationToken cancellationToken)
    {
        var applications = await _repository.GetByApplicantIdAsync(request.StudentId, cancellationToken);
        var latestApp = applications.OrderByDescending(a => a.SubmittedDate).FirstOrDefault();

        var programs = await _programRepository.GetAllAsync(cancellationToken);
        var programDtos = programs.Select(p => new ProgramOfferingDto(
            p.Id, p.College, p.Degree, p.Major, p.Duration, p.Intake, p.TuitionEstimate, p.Tags
        )).ToList();

        if (latestApp == null)
        {
            // If they haven't applied yet, just return the catalog
            return new JourneyStateDto(
                "Applicant",
                request.StudentId,
                0,
                new List<JourneyMilestoneDto>(),
                programDtos,
                new List<ApplicantDocumentDto>(),
                new List<TimelineEventDto>()
            );
        }

        var milestones = latestApp.TimelineEvents.Select(t => new JourneyMilestoneDto(
            t.Id,
            t.Title,
            t.Status,
            t.Description,
            t.DateCompleted
        )).ToList();

        var documents = latestApp.Documents.Select(d => new ApplicantDocumentDto(
            d.Id,
            d.Name,
            d.Status,
            d.UploadedAt,
            d.Feedback
        )).ToList();

        var timeline = latestApp.TimelineEvents
            .Where(t => t.DateCompleted != null)
            .OrderByDescending(t => t.DateCompleted)
            .Select(t => new TimelineEventDto(
                t.DateCompleted?.ToString("yyyy-MM-dd hh:mm tt") ?? "",
                t.Title,
                t.Description
            )).ToList();

        // Calculate stage based on status
        int stage = latestApp.Status switch
        {
            "Submitted" => 1,
            "Under Review" => 2,
            "Accepted" => 3,
            "Enrolled" => 4,
            _ => 1
        };

        return new JourneyStateDto(
            "Applicant",
            latestApp.Id,
            stage,
            milestones,
            programDtos,
            documents,
            timeline
        );
    }
}
