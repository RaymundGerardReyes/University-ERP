using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlacementCareer.Application.Features.GetJobPostings;

namespace PlacementCareer.Presentation.Endpoints;

[ApiController]
[Route("api/v1/career")]
public sealed class GetJobPostingsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetJobPostingsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("jobs")]
    [ProducesResponseType<IReadOnlyList<JobPostingDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetJobs(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetJobPostingsQuery(), cancellationToken);
        return Ok(result);
    }
}
