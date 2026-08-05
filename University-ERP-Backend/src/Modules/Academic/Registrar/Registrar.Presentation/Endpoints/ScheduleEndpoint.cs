namespace Registrar.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/academic/registrar/schedule")]
public sealed class ScheduleEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public ScheduleEndpoint(ISender sender) => _sender = sender;

    [HttpGet("faculty/{facultyId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFacultySchedule([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var query = new Registrar.Application.Features.Schedule.GetFacultyScheduleQuery(facultyId);
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }
}
