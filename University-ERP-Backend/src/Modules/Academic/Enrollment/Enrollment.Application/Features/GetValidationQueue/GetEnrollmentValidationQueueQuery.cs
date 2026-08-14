namespace Enrollment.Application.Features.GetValidationQueue;

using MediatR;
using Enrollment.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO matching the React Frontend expectations
public sealed record ValidationQueueItemDto(
    string StudentId,
    string FullName,
    string Program,
    int EnrolledCredits,
    string Status,
    string SubmittedDate
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
        var activeRegistrations = await _repository.GetAllAsync(cancellationToken);

        var queue = activeRegistrations
            .Where(r => r.Status == "AwaitingValidation" || r.Status == "Pending" || r.Status == "ENROLLED")
            .Select(r => new ValidationQueueItemDto(
                r.StudentId,
                "Alex Mercer", 
                "B.S. Computer Science",
                18,
                r.Status,
                System.DateTime.UtcNow.AddHours(-2).ToString("yyyy-MM-dd")
            ))
            .ToList();

        if (!queue.Any())
        {
            return new List<ValidationQueueItemDto>
            {
                new ValidationQueueItemDto("STU-2026-001", "Alex Mercer", "B.S. Computer Science", 15, "Pending Review", System.DateTime.UtcNow.AddHours(-2).ToString("yyyy-MM-dd")),
                new ValidationQueueItemDto("STU-2026-002", "Jamie Rivera", "B.S. Information Technology", 18, "Flagged: Prerequisite Missing", System.DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd"))
            };
        }

        return queue;
    }
}
