namespace AcademicScheduling.Presentation.Endpoints;

using AcademicScheduling.Application.Features.AllocateRoom;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/scheduling/rooms")]
public sealed class AllocateRoomEndpoint : ControllerBase
{
    private readonly ISender _sender;
    public AllocateRoomEndpoint(ISender sender) => _sender = sender;

    [HttpPost("allocate")]
    public async Task<IActionResult> Allocate([FromBody] AllocateRoomCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok(new { AllocationId = result.Value }) : Conflict(new { error = result.Error.Description });
    }
}