using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentInformation.Application.Features.GetStudentInformation;

namespace StudentInformation.Presentation.Endpoints;

[ApiController]
[Route("api/v1/students")]
public sealed class GetStudentInformationEndpoints : ControllerBase
{
    private readonly ISender _sender;

    public GetStudentInformationEndpoints(ISender sender) => _sender = sender;

    [HttpGet("profile/{studentId}")]
    [ProducesResponseType<StudentProfileDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetStudentProfileQuery(studentId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("enrollments/{studentId}")]
    [ProducesResponseType<IReadOnlyList<EnrollmentDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEnrollments([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetStudentEnrollmentsQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
