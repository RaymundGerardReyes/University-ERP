namespace Transport.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using Transport.Application.Features.AssignRoute;

[ApiController]
[Route("api/v1/transport/routes")]
public sealed class AssignRouteEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AssignRouteEndpoint(ISender sender) => _sender = sender;

    [HttpPost("{routeId:guid}/assign")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Assign([FromRoute] Guid routeId, [FromBody] AssignRouteRequest payload, CancellationToken cancellationToken)
    {
        var command = new AssignRouteCommand(routeId, payload.DriverId);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public sealed record AssignRouteRequest(string DriverId);
