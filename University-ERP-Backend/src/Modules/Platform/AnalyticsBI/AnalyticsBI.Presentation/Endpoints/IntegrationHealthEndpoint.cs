namespace AnalyticsBI.Presentation.Endpoints;

using AnalyticsBI.Application.Features.GetSystemHealth;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/analytics/integrations")]
public sealed class IntegrationHealthEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public IntegrationHealthEndpoint(ISender sender) => _sender = sender;

    [HttpGet("health")]
    [ProducesResponseType(typeof(IReadOnlyList<SystemHealthDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSystemHealth(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetSystemHealthQuery(), cancellationToken);
        return Ok(result);
    }
}