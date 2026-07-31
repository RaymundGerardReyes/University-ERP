namespace Registrar.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Registrar.Application.Features.EvaluateGraduationClearance;
using System;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/registrar/clearance")]
public sealed class EvaluateGraduationClearanceEndpoint : ControllerBase
{
    private readonly ISender _sender;
    public EvaluateGraduationClearanceEndpoint(ISender sender) => _sender = sender;

    [HttpPost("{clearanceId:guid}/evaluate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Evaluate(
        [FromRoute] Guid clearanceId, 
        [FromBody] EvaluateGraduationClearanceRequest payload, 
        CancellationToken cancellationToken)
    {
        var command = new EvaluateGraduationClearanceCommand(
            clearanceId, 
            payload.HasRequiredCredits, 
            payload.HasZeroBalance);
            
        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess 
            ? Ok(new { Status = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public sealed record EvaluateGraduationClearanceRequest(bool HasRequiredCredits, bool HasZeroBalance);