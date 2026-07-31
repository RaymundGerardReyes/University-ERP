namespace AssetManagement.Presentation.Endpoints;

using AssetManagement.Application.Features.RegisterAsset;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/assets")]
public sealed class RegisterAssetEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public RegisterAssetEndpoint(ISender sender) => _sender = sender;

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterAssetCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { AssetId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
