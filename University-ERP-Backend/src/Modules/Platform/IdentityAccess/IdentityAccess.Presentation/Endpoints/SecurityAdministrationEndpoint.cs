namespace IdentityAccess.Presentation.Endpoints;

using IdentityAccess.Application.Features.GetSecurityRoles;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/identity/admin")]
public sealed class SecurityAdministrationEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SecurityAdministrationEndpoint(ISender sender) => _sender = sender;

    [HttpGet("roles")]
    [ProducesResponseType(typeof(IReadOnlyList<RoleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoles(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetRolesQuery(), cancellationToken);
        return Ok(result);
    }
}