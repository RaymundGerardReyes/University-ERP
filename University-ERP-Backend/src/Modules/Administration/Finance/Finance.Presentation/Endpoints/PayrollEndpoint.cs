namespace Finance.Presentation.Endpoints;

using Finance.Application.Features.PayrollProcessing;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/payroll")]
public sealed class PayrollEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public PayrollEndpoint(ISender sender) => _sender = sender;

    [HttpPost("disburse")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Disburse([FromBody] DisbursePayrollRequest request, CancellationToken cancellationToken)
    {
        var command = new DisbursePayrollCommand(
            request.EmployeeId, 
            request.DestinationAccount, 
            request.Amount, 
            request.PayPeriod);

        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { success = true, transactionId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public sealed record DisbursePayrollRequest(string EmployeeId, string DestinationAccount, decimal Amount, string PayPeriod);

