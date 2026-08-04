namespace AcademicScheduling.Presentation.Endpoints;

using AcademicScheduling.Application.Features.GetFacultyCourses;
using AcademicScheduling.Application.Features.SubmitAttendance;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/teaching")]
public sealed class TeachingEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public TeachingEndpoint(ISender sender) => _sender = sender;

    [HttpGet("faculty/{facultyId}/courses")]
    [ProducesResponseType(typeof(IReadOnlyList<CourseSectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyCourses(
        [FromRoute] string facultyId, 
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetFacultyCoursesQuery(facultyId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("sections/{sectionId}/attendance")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitAttendance(
        [FromRoute] string sectionId, 
        [FromBody] object attendanceData, 
        CancellationToken cancellationToken)
    {
        var command = new SubmitAttendanceCommand(sectionId, attendanceData);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}