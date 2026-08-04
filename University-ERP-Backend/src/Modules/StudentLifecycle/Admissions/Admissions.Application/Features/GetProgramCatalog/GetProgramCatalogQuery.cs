namespace Admissions.Application.Features.GetProgramCatalog;

using MediatR;
using Admissions.Application.Abstractions;

public sealed record ProgramOfferingDto(
    string Id,
    string College,
    string Degree,
    string Major,
    string Duration,
    string Intake,
    string TuitionEstimate,
    IReadOnlyCollection<string> Tags
);

public sealed record GetProgramCatalogQuery() : IRequest<IReadOnlyList<ProgramOfferingDto>>;

public sealed class GetProgramCatalogQueryHandler : IRequestHandler<GetProgramCatalogQuery, IReadOnlyList<ProgramOfferingDto>>
{
    private readonly IProgramOfferingRepository _repository;

    public GetProgramCatalogQueryHandler(IProgramOfferingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<ProgramOfferingDto>> Handle(GetProgramCatalogQuery request, CancellationToken cancellationToken)
    {
        var offerings = await _repository.GetAllAsync(cancellationToken);
        
        return offerings.Select(o => new ProgramOfferingDto(
            o.Id,
            o.College,
            o.Degree,
            o.Major,
            o.Duration,
            o.Intake,
            o.TuitionEstimate,
            o.Tags
        )).ToList();
    }
}
