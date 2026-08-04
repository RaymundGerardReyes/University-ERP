namespace QualityAccreditation.Presentation.Endpoints;

using QualityAccreditation.Application.Features.GetActiveWorkflows;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/governance/workflows")]
public sealed class WorkflowEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public WorkflowEndpoint(ISender sender) => _sender = sender;

    [HttpGet("active")]
    [ProducesResponseType(typeof(IReadOnlyList<WorkflowDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetWorkflows(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetActiveWorkflowsQuery(), cancellationToken);
        return Ok(result);
    }
}