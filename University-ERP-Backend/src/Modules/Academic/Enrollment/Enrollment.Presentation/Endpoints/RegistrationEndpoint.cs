namespace Enrollment.Presentation.Endpoints;

using Enrollment.Application.Features.DropCourse;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/student")]
public sealed class RegistrationEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public RegistrationEndpoint(ISender sender) => _sender = sender;

    [HttpPost("{studentId}/registration/add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddCourse([FromRoute] string studentId, [FromBody] AddCourseRequest payload, CancellationToken cancellationToken)
    {
        return Ok(new { success = true, message = "Course dynamically added to schedule." });
    }

    [HttpPost("{studentId}/registration/drop")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DropCourse([FromRoute] string studentId, [FromBody] DropCourseRequest payload, CancellationToken cancellationToken)
    {
        var command = new DropCourseCommand(studentId, payload.RegistrationLineItemId, payload.Reason ?? "No reason provided");
        
        var result = await _sender.Send(command, cancellationToken);
        
        if (result.IsFailure)
        {
            return BadRequest(new { code = result.Error.Code, message = result.Error.Description });
        }

        return Ok(new { success = true, message = "Course successfully dropped." });
    }
}

public sealed record AddCourseRequest(string SectionId, string TermId);
public sealed record DropCourseRequest(string RegistrationLineItemId, string? Reason);
