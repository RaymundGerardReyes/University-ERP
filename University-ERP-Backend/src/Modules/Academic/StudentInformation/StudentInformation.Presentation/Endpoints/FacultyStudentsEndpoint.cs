namespace StudentInformation.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentInformation.Application.Features.GetMyStudents;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/faculty-students")]
public sealed class FacultyStudentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public FacultyStudentsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}")]
    [ProducesResponseType(typeof(IReadOnlyList<StudentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyStudents([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetMyStudentsQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}
