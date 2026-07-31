namespace Payroll.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payroll.Application.Features.GeneratePayslip;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/payroll/payslips")]
public sealed class GeneratePayslipEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GeneratePayslipEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Generate([FromBody] GeneratePayslipCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { PayslipId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
