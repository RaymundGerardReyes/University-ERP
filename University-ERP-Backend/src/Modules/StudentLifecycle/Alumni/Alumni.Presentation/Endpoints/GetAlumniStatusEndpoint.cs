using Alumni.Application.Features.GetAlumniStatus;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Alumni.Presentation.Endpoints;

[ApiController]
[Route("api/v1/alumni")]
public sealed class GetAlumniStatusEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetAlumniStatusEndpoint(ISender sender) => _sender = sender;

    [HttpGet("status/{studentId}")]
    [ProducesResponseType<AlumniStatusDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStatus([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAlumniStatusQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
