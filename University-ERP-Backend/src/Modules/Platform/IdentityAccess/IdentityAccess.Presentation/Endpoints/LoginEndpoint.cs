namespace IdentityAccess.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IdentityAccess.Application.Features.AuthenticateUser;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/identity")]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
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
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Login([FromBody] AuthenticateUserQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        
        if (result.IsSuccess)
        {
            var host = Request.Host.Host;
            var domain = "localhost";
            if (!host.Contains("localhost"))
            {
                var parts = host.Split('.');
                if (parts.Length >= 2)
                {
                    domain = "." + parts[parts.Length - 2] + "." + parts[parts.Length - 1];
                }
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Cloudflare tunnel enforces HTTPS
                SameSite = SameSiteMode.Lax, // Lax allows cross-subdomain navigation to send the cookie
                Expires = DateTimeOffset.UtcNow.AddHours(8),
                Domain = domain // CRITICAL: Allow cookie to be sent across all portals
            };
            Response.Cookies.Append("AuthToken", result.Value.Token, cookieOptions);
            return Ok(result.Value);
        }

        if (result.Error.Code == "Auth.InvalidCredentials")
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { code = result.Error.Code, message = result.Error.Description });
        }

        return BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
