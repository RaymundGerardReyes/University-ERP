using Hostel.Application.Features.GetRoomAllocation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Presentation.Endpoints;

[ApiController]
[Route("api/v1/hostel")]
public sealed class GetRoomAllocationEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetRoomAllocationEndpoint(ISender sender) => _sender = sender;

    [HttpGet("allocation/{studentId}")]
    [ProducesResponseType<RoomAllocationDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllocation([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetRoomAllocationQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
