using MediatR;
using Admissions.Application.Abstractions;

namespace Admissions.Application.Features.GetApplicationStatus;

public sealed record ApplicationStatusDto(
    string Id,
    string ProgramName,
    string Status,
    DateTime SubmittedDate,
    List<string> MissingDocuments
);

public sealed record GetApplicationStatusQuery(string StudentId) : IRequest<IReadOnlyList<ApplicationStatusDto>>;

public sealed class GetApplicationStatusQueryHandler : IRequestHandler<GetApplicationStatusQuery, IReadOnlyList<ApplicationStatusDto>>
{
    private readonly IAdmissionApplicationRepository _repository;
    private readonly IProgramOfferingRepository _programRepository;

    public GetApplicationStatusQueryHandler(IAdmissionApplicationRepository repository, IProgramOfferingRepository programRepository)
    {
        _repository = repository;
        _programRepository = programRepository;
    }

    public async Task<IReadOnlyList<ApplicationStatusDto>> Handle(GetApplicationStatusQuery request, CancellationToken cancellationToken)
    {
        var applications = await _repository.GetByApplicantIdAsync(request.StudentId, cancellationToken);
        var result = new List<ApplicationStatusDto>();

        foreach (var app in applications)
        {
            var program = await _programRepository.GetByIdAsync(app.ProgramId, cancellationToken);
            var programName = program?.Major ?? "Unknown Program";
            
            var missingDocs = app.Documents
                .Where(d => d.Status != "Verified" && d.Status != "Uploaded")
                .Select(d => d.Name)
                .ToList();

            result.Add(new ApplicationStatusDto(app.Id, programName, app.Status, app.SubmittedDate, missingDocs));
        }

        return result;
    }
}
