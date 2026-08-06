namespace Admissions.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Admissions.Application.Features.VerifyDocuments;
using Admissions.Application.Features.EvaluateApplication;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/admissions")]
public sealed class AdmissionsWorkflowEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AdmissionsWorkflowEndpoint(ISender sender) => _sender = sender;

    [HttpPost("{id}/verify-and-forward")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> VerifyAndForward([FromRoute] string id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new VerifyDocumentsCommand(id), cancellationToken);
        if (result.IsFailure) return NotFound(result.Error);
        return Ok();
    }

    [HttpPost("{id}/evaluate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EvaluateApplication(
        [FromRoute] string id, 
        [FromBody] EvaluateApplicationRequest request, 
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new EvaluateApplicationCommand(id, request.Decision, request.Notes ?? ""), cancellationToken);
        if (result.IsFailure) return NotFound(result.Error);
        return Ok();
    }
}

public sealed record EvaluateApplicationRequest(string Decision, string Notes);
