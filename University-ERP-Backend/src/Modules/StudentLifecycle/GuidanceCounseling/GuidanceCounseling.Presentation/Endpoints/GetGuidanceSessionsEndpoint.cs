using GuidanceCounseling.Application.Features.GetGuidanceSessions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GuidanceCounseling.Presentation.Endpoints;

[ApiController]
[Route("api/v1/guidance")]
public sealed class GetGuidanceSessionsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetGuidanceSessionsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("sessions/{studentId}")]
    [ProducesResponseType<IReadOnlyList<CounselingSessionDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSessions([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetGuidanceSessionsQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
