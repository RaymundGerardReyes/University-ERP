using Admissions.Application.Features.GetApplicationStatus;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Admissions.Presentation.Endpoints;

[ApiController]
[Route("api/v1/admissions")]
public sealed class GetApplicationStatusEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetApplicationStatusEndpoint(ISender sender) => _sender = sender;

    [HttpGet("status/{studentId}")]
    [ProducesResponseType<IReadOnlyList<ApplicationStatusDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStatus([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetApplicationStatusQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
