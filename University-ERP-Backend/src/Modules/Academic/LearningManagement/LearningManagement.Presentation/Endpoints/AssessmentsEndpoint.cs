namespace LearningManagement.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/academic/learning-management/assessments")]
public sealed class AssessmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AssessmentsEndpoint(ISender sender) => _sender = sender;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAssessments(CancellationToken cancellationToken)
    {
        var query = new LearningManagement.Application.Features.Assessments.GetAssessmentsQuery();
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }
}
