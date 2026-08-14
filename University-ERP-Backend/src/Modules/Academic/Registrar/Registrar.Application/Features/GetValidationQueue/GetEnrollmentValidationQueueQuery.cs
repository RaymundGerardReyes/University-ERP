using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Academic.Application.Features.Registrar.GetValidationQueue
{
    // 1. The DTO representing a student in the validation queue
    public sealed record ValidationQueueItemDto(
        string StudentId,
        string FullName,
        string Program,
        int EnrolledCredits,
        string Status,
        string SubmittedDate
    );

    // 2. The MediatR Query
    public sealed record GetEnrollmentValidationQueueQuery() : IRequest<IReadOnlyList<ValidationQueueItemDto>>;

    // 3. The Handler containing the business logic
    public sealed class GetEnrollmentValidationQueueQueryHandler : IRequestHandler<GetEnrollmentValidationQueueQuery, IReadOnlyList<ValidationQueueItemDto>>
    {
        public Task<IReadOnlyList<ValidationQueueItemDto>> Handle(GetEnrollmentValidationQueueQuery request, CancellationToken cancellationToken)
        {
            var mockQueue = new List<ValidationQueueItemDto>
            {
                new("STU-2026-001", "Alex Mercer", "B.S. Computer Science", 15, "Pending Review", DateTime.UtcNow.AddHours(-2).ToString("yyyy-MM-dd")),
                new("STU-2026-002", "Jamie Rivera", "B.S. Information Technology", 18, "Flagged: Prerequisite Missing", DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd"))
            };

            return Task.FromResult<IReadOnlyList<ValidationQueueItemDto>>(mockQueue);
        }
    }
}
