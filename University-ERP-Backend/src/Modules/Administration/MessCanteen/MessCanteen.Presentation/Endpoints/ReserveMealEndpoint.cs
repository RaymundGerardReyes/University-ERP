namespace MessCanteen.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using MessCanteen.Application.Features.ReserveMeal;

[ApiController]
[Route("api/v1/canteen/reservations")]
public sealed class ReserveMealEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public ReserveMealEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Reserve([FromBody] ReserveMealCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { ReservationId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
