namespace Helpdesk.Presentation.Endpoints;

using Helpdesk.Application.Features.CreateTicket;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/governance/tickets")]
public sealed class CreateTicketEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public CreateTicketEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateTicketCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { TicketId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
