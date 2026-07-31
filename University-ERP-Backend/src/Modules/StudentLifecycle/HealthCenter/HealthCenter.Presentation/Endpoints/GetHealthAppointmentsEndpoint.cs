using HealthCenter.Application.Features.GetHealthAppointments;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCenter.Presentation.Endpoints;

[ApiController]
[Route("api/v1/health")]
public sealed class GetHealthAppointmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetHealthAppointmentsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("appointments/{studentId}")]
    [ProducesResponseType<IReadOnlyList<HealthAppointmentDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAppointments([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetHealthAppointmentsQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
