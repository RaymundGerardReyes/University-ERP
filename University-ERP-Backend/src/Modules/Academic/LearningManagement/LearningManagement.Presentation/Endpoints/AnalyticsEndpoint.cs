namespace LearningManagement.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LearningManagement.Application.Features.Analytics;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/analytics")]
public sealed class AnalyticsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AnalyticsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}/performance")]
    [ProducesResponseType(typeof(IReadOnlyList<ClassPerformanceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClassPerformance([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetClassPerformanceQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}
