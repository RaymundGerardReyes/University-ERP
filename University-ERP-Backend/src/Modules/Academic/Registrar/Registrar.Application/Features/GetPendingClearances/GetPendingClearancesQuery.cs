using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Academic.Application.Features.Registrar.GetPendingClearances
{
    // 1. The DTO representing a student clearance request
    public sealed record PendingClearanceDto(
        string StudentId,
        string FullName,
        string Program,
        string ClearanceType,
        string Status,
        string RequestDate
    );

    // 2. The MediatR Query
    public sealed record GetPendingClearancesQuery() : IRequest<IReadOnlyList<PendingClearanceDto>>;

    // 3. The Handler containing the business logic
    public sealed class GetPendingClearancesQueryHandler : IRequestHandler<GetPendingClearancesQuery, IReadOnlyList<PendingClearanceDto>>
    {
        public Task<IReadOnlyList<PendingClearanceDto>> Handle(GetPendingClearancesQuery request, CancellationToken cancellationToken)
        {
            // Simulated database records for the UI. 
            // To be replaced with: await _repository.GetPendingClearancesAsync(cancellationToken);
            var mockClearances = new List<PendingClearanceDto>
            {
                new("STU-2023-042", "Emma Watson", "B.S. Information Technology", "Graduation", "Pending Library Clearance", DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd")),
                new("STU-2024-108", "Liam Chen", "B.S. Computer Science", "Transfer", "Pending Finance Clearance", DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd"))
            };

            return Task.FromResult<IReadOnlyList<PendingClearanceDto>>(mockClearances);
        }
    }
}
