namespace Admissions.Presentation.Endpoints;

using Admissions.Application.Features.GetApplicationStatus;
using MediatR;
using Microsoft.AspNetCore.Authorization; // Add this import
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/v1/admissions")]
public sealed class GetApplicationStatusEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetApplicationStatusEndpoint(ISender sender) => _sender = sender;

    [Authorize] // Enforce the JWT Bearer token supplied by the frontend
    [HttpGet("status/{studentId}")]
    [ProducesResponseType(typeof(IReadOnlyList<ApplicationStatusDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStatus([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetApplicationStatusQuery(studentId), cancellationToken);
        return Ok(result);
    }
}