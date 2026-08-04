namespace IdentityAccess.Application.Features.GetSecurityRoles;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed record RoleDto(string Name, string Description, int UsersAssigned);

public sealed record GetRolesQuery() : IRequest<IReadOnlyList<RoleDto>>;

public sealed class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, IReadOnlyList<RoleDto>>
{
    public Task<IReadOnlyList<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        // Mock data mapping exactly to the frontend UI table
        var mockRoles = new List<RoleDto>
        {
            new("System Administrator", "Full access to all platform configurations.", 3),
            new("Dean", "Academic governance for a specific college.", 12),
            new("Registrar", "Management of student records and enrollments.", 8),
            new("Faculty", "Standard teaching and grading access.", 450)
        };

        return Task.FromResult<IReadOnlyList<RoleDto>>(mockRoles);
    }
}