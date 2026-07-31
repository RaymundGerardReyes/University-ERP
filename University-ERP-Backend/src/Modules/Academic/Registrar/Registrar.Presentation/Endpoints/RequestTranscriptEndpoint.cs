namespace Registrar.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Registrar.Application.Features.RequestTranscript;

[ApiController]
[Route("api/v1/registrar/transcripts")]
public sealed class RequestTranscriptEndpoint : ControllerBase
{
    private readonly ISender _sender;
    public RequestTranscriptEndpoint(ISender sender) => _sender = sender;

    [HttpPost("request")]
    public async Task<IActionResult> RequestTranscript([FromBody] RequestTranscriptCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok(new { TranscriptId = result.Value }) : BadRequest(result.Error);
    }
}