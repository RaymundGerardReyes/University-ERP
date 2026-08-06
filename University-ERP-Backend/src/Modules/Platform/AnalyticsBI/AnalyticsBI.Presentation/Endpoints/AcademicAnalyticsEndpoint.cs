namespace AnalyticsBI.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AnalyticsBI.Application.Features.GetClassPerformance;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/analytics")]
public sealed class AcademicAnalyticsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AcademicAnalyticsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}/performance")]
    [ProducesResponseType(typeof(IReadOnlyList<ClassPerformanceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPerformance([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetClassPerformanceQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}