namespace IdentityAccess.Presentation.Endpoints;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v1/platform/identity")]
public class ValidateSessionEndpoint : ControllerBase
{
    private readonly Microsoft.AspNetCore.Authorization.IAuthorizationService _authorizationService;

    public ValidateSessionEndpoint(Microsoft.AspNetCore.Authorization.IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    [HttpGet("validate")]
    public async System.Threading.Tasks.Task<IActionResult> Validate([FromHeader(Name = "X-Portal-Target")] string? portalTarget)
    {
        // 1. The user is guaranteed to be authenticated at this point because of the Global FallbackPolicy.
        if (string.IsNullOrEmpty(portalTarget))
        {
            return Ok();
        }

        // 2. Map the X-Portal-Target header to the corresponding Named Policy
        var policyName = $"Portal.{portalTarget}.Access";

        // 3. Evaluate the Policy using the native ASP.NET Core Authorization Pipeline
        var result = await _authorizationService.AuthorizeAsync(User, policyName);

        if (result.Succeeded)
        {
            return Ok();
        }

        return StatusCode(403);
    }
}
