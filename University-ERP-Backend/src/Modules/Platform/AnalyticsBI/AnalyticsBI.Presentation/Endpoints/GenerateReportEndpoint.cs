namespace AnalyticsBI.Presentation.Endpoints;

using AnalyticsBI.Application.Features.GenerateReport;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/analytics")]
public sealed class GenerateReportEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GenerateReportEndpoint(ISender sender) => _sender = sender;

    [HttpPost("generate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Generate([FromBody] GenerateReportCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { ReportId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
