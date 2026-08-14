namespace Teaching.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Teaching.Application.Features.GetMyCourses;
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
    public async Task<IActionResult> GetMyCourses([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetMyCoursesQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}
