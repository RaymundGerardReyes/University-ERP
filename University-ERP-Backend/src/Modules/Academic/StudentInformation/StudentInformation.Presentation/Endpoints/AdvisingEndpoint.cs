namespace StudentInformation.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentInformation.Application.Features.GetAdvisees;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/advising")] // Matches the frontend axios BASE_URL
public sealed class AdvisingEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AdvisingEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}/advisees")]
    [ProducesResponseType(typeof(IReadOnlyList<AdviseeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAdvisees([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAdviseesQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}