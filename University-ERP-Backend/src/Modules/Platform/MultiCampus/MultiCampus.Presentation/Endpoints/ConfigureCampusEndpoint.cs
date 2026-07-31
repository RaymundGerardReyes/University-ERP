namespace MultiCampus.Presentation.Endpoints;

using MultiCampus.Application.Features.ConfigureCampus;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/multicampus")]
public sealed class ConfigureCampusEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public ConfigureCampusEndpoint(ISender sender) => _sender = sender;

    [HttpPost("campuses")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Configure([FromBody] ConfigureCampusCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { CampusId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
