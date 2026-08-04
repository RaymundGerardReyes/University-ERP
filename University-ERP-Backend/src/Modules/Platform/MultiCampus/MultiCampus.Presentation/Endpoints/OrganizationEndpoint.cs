namespace MultiCampus.Presentation.Endpoints;

using MultiCampus.Application.Features.GetOrganizationHierarchy;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/multicampus/organization")]
public sealed class OrganizationEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public OrganizationEndpoint(ISender sender) => _sender = sender;

    [HttpGet("hierarchy")]
    [ProducesResponseType(typeof(IReadOnlyList<OrgNodeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHierarchy(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetOrganizationHierarchyQuery(), cancellationToken);
        return Ok(result);
    }
}