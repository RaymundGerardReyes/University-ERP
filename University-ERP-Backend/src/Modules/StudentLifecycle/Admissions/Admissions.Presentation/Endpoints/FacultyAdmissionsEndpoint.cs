namespace Admissions.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Admissions.Application.Features.ApproveApplication;
using Admissions.Application.Features.GetPendingApplications; // Fixes CS0246
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/admissions/faculty")]
public sealed class FacultyAdmissionsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public FacultyAdmissionsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("pending")]
    [ProducesResponseType(typeof(IReadOnlyList<PendingApplicationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingApplications(
        [FromQuery] string? department, 
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetPendingApplicationsQuery(department), cancellationToken);
        return Ok(result);
    }
    
    [HttpPost("{id}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ApproveApplication(
        [FromRoute] string id, 
        [FromBody] ApproveRequest payload, 
        CancellationToken cancellationToken)
    {
        var command = new ApproveApplicationCommand(id, payload.Action);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public sealed record ApproveRequest(string Action);