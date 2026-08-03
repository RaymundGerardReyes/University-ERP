namespace IdentityAccess.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IdentityAccess.Application.Features.AuthenticateUser;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/identity")]
public class LoginEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public LoginEndpoint(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] AuthenticateUserQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(result.Value) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
