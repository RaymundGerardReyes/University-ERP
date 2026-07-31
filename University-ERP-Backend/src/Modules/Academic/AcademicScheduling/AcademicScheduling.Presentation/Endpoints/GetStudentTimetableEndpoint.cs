namespace AcademicScheduling.Presentation.Endpoints;

using AcademicScheduling.Application.Features.GetStudentTimetable;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/scheduling/timetables")]
public sealed class GetStudentTimetableEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetStudentTimetableEndpoint(ISender sender) => _sender = sender;

    [HttpGet("student/{studentId:guid}")]
    [ProducesResponseType<IReadOnlyList<TimetableEntryDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTimetable([FromRoute] Guid studentId, [FromQuery] string term, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetStudentTimetableQuery(studentId, term), cancellationToken);
        return Ok(result);
    }
}