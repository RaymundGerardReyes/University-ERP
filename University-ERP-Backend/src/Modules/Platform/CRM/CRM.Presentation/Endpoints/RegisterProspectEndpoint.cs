namespace CRM.Presentation.Endpoints;

using CRM.Application.Features.RegisterProspect;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/crm")]
public sealed class RegisterProspectEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public RegisterProspectEndpoint(ISender sender) => _sender = sender;

    [HttpPost("prospects")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterProspectCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { ProspectId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
