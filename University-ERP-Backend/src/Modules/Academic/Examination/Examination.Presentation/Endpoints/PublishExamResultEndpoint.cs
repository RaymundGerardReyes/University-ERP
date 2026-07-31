namespace Examination.Presentation.Endpoints;

using Examination.Application.Features.PublishExamResult;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/examination/results")]
public sealed class PublishExamResultEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public PublishExamResultEndpoint(ISender sender) => _sender = sender;

    [HttpPost("publish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> PublishResult([FromBody] PublishExamResultCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok() : BadRequest(result.Error);
    }
}