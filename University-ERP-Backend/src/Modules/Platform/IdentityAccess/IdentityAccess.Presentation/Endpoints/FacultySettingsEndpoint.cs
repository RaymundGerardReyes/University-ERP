namespace IdentityAccess.Presentation.Endpoints;

using IdentityAccess.Application.Features.FacultySettings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/settings/faculty")]
public sealed class FacultySettingsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public FacultySettingsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}")]
    [ProducesResponseType(typeof(FacultySettingsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSettings([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetFacultySettingsQuery(facultyId), cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{facultyId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateSettings(
        [FromRoute] string facultyId, 
        [FromBody] UpdateFacultySettingsCommand payload, 
        CancellationToken cancellationToken)
    {
        // Ensure the ID in the route matches the command payload
        var command = payload with { FacultyId = facultyId };
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}