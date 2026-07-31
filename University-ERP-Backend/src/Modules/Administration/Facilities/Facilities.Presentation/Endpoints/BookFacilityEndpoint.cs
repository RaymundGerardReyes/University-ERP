namespace Facilities.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using Facilities.Application.Features.BookFacility;

[ApiController]
[Route("api/v1/facilities/reservations")]
public sealed class BookFacilityEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public BookFacilityEndpoint(ISender sender) => _sender = sender;

    [HttpPost("book")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Book([FromBody] BookFacilityCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { ReservationId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
