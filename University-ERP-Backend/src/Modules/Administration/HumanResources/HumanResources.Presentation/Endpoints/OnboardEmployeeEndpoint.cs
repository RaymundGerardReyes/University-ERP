namespace HumanResources.Presentation.Endpoints;

using HumanResources.Application.Features.OnboardEmployee;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/hr/employees")]
public sealed class OnboardEmployeeEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public OnboardEmployeeEndpoint(ISender sender) => _sender = sender;

    [HttpPost("onboard")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Onboard([FromBody] OnboardEmployeeCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { EmployeeId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
