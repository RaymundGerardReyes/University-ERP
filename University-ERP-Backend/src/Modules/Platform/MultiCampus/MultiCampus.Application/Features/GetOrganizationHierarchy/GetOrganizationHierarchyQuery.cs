namespace MultiCampus.Application.Features.GetOrganizationHierarchy;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed record OrgNodeDto(string Name, string Type, IReadOnlyList<string> Children);

public sealed record GetOrganizationHierarchyQuery() : IRequest<IReadOnlyList<OrgNodeDto>>;

public sealed class GetOrganizationHierarchyQueryHandler : IRequestHandler<GetOrganizationHierarchyQuery, IReadOnlyList<OrgNodeDto>>
{
    public Task<IReadOnlyList<OrgNodeDto>> Handle(GetOrganizationHierarchyQuery request, CancellationToken cancellationToken)
    {
        var mockHierarchy = new List<OrgNodeDto>
        {
            new("College of Engineering", "College", new List<string> { "Department of Computer Science", "Department of Civil Engineering" }),
            new("College of Business", "College", new List<string> { "Department of Accountancy" }),
            new("Main Administration Building", "Facility", new List<string>()),
            new("University Library", "Facility", new List<string>())
        };

        return Task.FromResult<IReadOnlyList<OrgNodeDto>>(mockHierarchy);
    }
}