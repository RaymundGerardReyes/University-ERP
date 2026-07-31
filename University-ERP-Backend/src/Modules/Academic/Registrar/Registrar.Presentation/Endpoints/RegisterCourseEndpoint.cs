namespace Registrar.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Registrar.Application.Features.RegisterCourse;

[ApiController]
[Route("api/v1/registrar/courses")]
public sealed class RegisterCourseEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public RegisterCourseEndpoint(ISender sender) => _sender = sender;

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCourseCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { RegistrationId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}