namespace Finance.Presentation.Endpoints;

using Finance.Application.Features.CashTransactions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/cash-transactions")]
public sealed class CashTransactionsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public CashTransactionsEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateToken([FromBody] GenerateCashTokenCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { token = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }

    [HttpGet("{token}")]
    [ProducesResponseType(typeof(CashTransactionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTransaction([FromRoute] string token, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetPendingCashTransactionQuery(token), cancellationToken);
        
        return result.IsSuccess 
            ? Ok(result.Value) 
            : NotFound(new { code = result.Error.Code, message = result.Error.Description });
    }

    [HttpPost("{token}/complete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CompleteTransaction([FromRoute] string token, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new CompleteCashTransactionCommand(token), cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}