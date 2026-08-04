namespace StudentInformation.Application.Features.GetAdvisees;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO perfectly matching the frontend 'Advisee' interface
public sealed record AdviseeDto(
    string StudentId, 
    string Name, 
    string Program, 
    int DegreeProgress, 
    string Status
);

// 2. The MediatR Query
public sealed record GetAdviseesQuery(string FacultyId) : IRequest<IReadOnlyList<AdviseeDto>>;

// 3. The Handler
public sealed class GetAdviseesQueryHandler : IRequestHandler<GetAdviseesQuery, IReadOnlyList<AdviseeDto>>
{
    public Task<IReadOnlyList<AdviseeDto>> Handle(GetAdviseesQuery request, CancellationToken cancellationToken)
    {
        // In a full implementation, we would query the IStudentRepository here.
        // Returning mock data structured exactly for the new UI:
        var mockData = new List<AdviseeDto>
        {
            new("STU-1042", "Michael Ross", "BSCS", 85, "On Track"),
            new("STU-1045", "Rachel Zane", "BSIT", 45, "At Risk"),
            new("STU-1088", "Donna Paulsen", "BSCS", 98, "Action Required")
        };

        return Task.FromResult<IReadOnlyList<AdviseeDto>>(mockData);
    }
}