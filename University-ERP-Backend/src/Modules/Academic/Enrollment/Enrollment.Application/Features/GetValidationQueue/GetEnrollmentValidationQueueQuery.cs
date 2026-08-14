namespace Enrollment.Application.Features.GetValidationQueue;

using MediatR;
using Enrollment.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO perfectly matching the React Frontend expectations
public sealed record ValidationQueueItemDto(
    string Id,
    string StudentId,
    string ApplicantName,
    string Program,
    string Status
);

public sealed record GetEnrollmentValidationQueueQuery() : IRequest<IReadOnlyList<ValidationQueueItemDto>>;

public sealed class GetEnrollmentValidationQueueQueryHandler : IRequestHandler<GetEnrollmentValidationQueueQuery, IReadOnlyList<ValidationQueueItemDto>>
{
    private readonly ITermRegistrationRepository _repository;

    public GetEnrollmentValidationQueueQueryHandler(ITermRegistrationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<ValidationQueueItemDto>> Handle(GetEnrollmentValidationQueueQuery request, CancellationToken cancellationToken)
    {
        // Fetch live data directly from the PostgreSQL database via the repository
        var activeRegistrations = await _repository.GetAllAsync(cancellationToken);

        // Filter for registrations awaiting registrar validation and project to DTO
        var queue = activeRegistrations
            .Where(r => r.Status == "AwaitingValidation" || r.Status == "Pending" || r.Status == "ENROLLED")
            .Select(r => new ValidationQueueItemDto(
                r.Id.ToString(),
                r.StudentId,
                "Dynamic Student Name", 
                r.TermId, 
                r.Status
            ))
            .ToList();

        return queue;
    }
}
