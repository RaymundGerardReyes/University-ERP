namespace VisitorManagement.Presentation.Endpoints;

using VisitorManagement.Application.Features.RegisterVisitor;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/governance/visitors")]
public sealed class RegisterVisitorEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public RegisterVisitorEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterVisitorCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { VisitorLogId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
