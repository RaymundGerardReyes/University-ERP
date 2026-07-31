namespace StudentInformation.Presentation.Controllers;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using StudentInformation.Application.Features.EnrollStudent;
using StudentInformation.Presentation.Contracts;

/// <summary>
/// REST API Controller for StudentInformation operations.
/// </summary>
[ApiController]
[Route("api/v1/students")]
public sealed class StudentsController : ControllerBase
{
    private readonly ISender _sender;

    public StudentsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Enrolls a new student into the system.
    /// </summary>
    [HttpPost("enroll")]
    public async Task<IActionResult> EnrollStudent(
        [FromBody] EnrollStudentRequest request,
        CancellationToken cancellationToken)
    {
        var command = new EnrollStudentCommand(
            request.IdentityUserId,
            request.EnrollmentNumber);

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new { code = result.Error.Code, message = result.Error.Description });
        }

        return Ok(new { studentId = result.Value.Value });
    }
}
