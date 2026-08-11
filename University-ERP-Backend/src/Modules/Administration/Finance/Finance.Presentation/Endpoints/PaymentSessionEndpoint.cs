namespace Finance.Presentation.Endpoints;

using Finance.Application.Features.PaymentSessions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/payment-sessions")]
public sealed class PaymentSessionEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public PaymentSessionEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateSession([FromBody] CreatePaymentSessionCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { sessionId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }

    [HttpGet("{sessionId}")]
    [ProducesResponseType(typeof(PaymentSessionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ValidateSession([FromRoute] string sessionId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new ValidatePaymentSessionQuery(sessionId), cancellationToken);
        
        return result.IsSuccess 
            ? Ok(result.Value) 
            : NotFound(new { code = result.Error.Code, message = result.Error.Description });
    }

    [HttpPost("{sessionId}/complete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CompleteSession([FromRoute] string sessionId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new CompletePaymentSessionCommand(sessionId), cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }

    [HttpGet("{sessionId}/qr")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDynamicQR([FromRoute] string sessionId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GenerateDynamicQRCommand(sessionId), cancellationToken);
        
        if (!result.IsSuccess)
        {
            if (result.Error.Code == "PaymentSession.NotFound")
                return NotFound(new { code = result.Error.Code, message = result.Error.Description });
                
            return BadRequest(new { code = result.Error.Code, message = result.Error.Description });
        }

        return Ok(new { qrPayload = result.Value });
    }
}
