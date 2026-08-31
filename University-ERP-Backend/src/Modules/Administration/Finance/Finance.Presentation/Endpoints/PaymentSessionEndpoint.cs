namespace Finance.Presentation.Endpoints;

using Finance.Application.Features.PaymentSessions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/payment-sessions")]
public sealed class PaymentSessionEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public PaymentSessionEndpoint(ISender sender) => _sender = sender;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PaymentSessionRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllSessions(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllPaymentSessionsQuery(), cancellationToken);
        
        return result.IsSuccess 
            ? Ok(result.Value) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }

    [HttpPost]
    [ProducesResponseType(typeof(CreatePaymentSessionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> CreateSession(
        [FromBody] CreatePaymentSessionRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKeyHeader,
        CancellationToken cancellationToken)
    {
        var idempotencyKey = !string.IsNullOrWhiteSpace(idempotencyKeyHeader)
            ? idempotencyKeyHeader
            : Request.Headers["Idempotency-Key"].FirstOrDefault();

        var command = new CreatePaymentSessionCommand(
            request.InvoiceId,
            request.ApplicantId,
            request.Amount,
            request.Purpose,
            idempotencyKey);

        var result = await _sender.Send(command, cancellationToken);
        
        if (!result.IsSuccess)
        {
            if (result.Error.Code.Contains("Gateway") || 
                result.Error.Code.Contains("Banking") || 
                result.Error.Code.Contains("Unavailable") || 
                result.Error.Code.Contains("NetworkError") || 
                result.Error.Description.Contains("502"))
            {
                return StatusCode(StatusCodes.Status502BadGateway, new 
                { 
                    code = "BadGateway", 
                    message = "The payment provider is temporarily unavailable. Please try again later.",
                    details = result.Error.Description
                });
            }

            return BadRequest(new { code = result.Error.Code, message = result.Error.Description });
        }

        return Ok(result.Value);
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

    [HttpPost("{sessionId}/reconcile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ReconcileSession([FromRoute] string sessionId, [FromBody] ReconcilePaymentSessionRequest payload, CancellationToken cancellationToken)
    {
        var command = new ReconcilePaymentSessionCommand(sessionId, payload.CashierId, payload.Remarks);
        var result = await _sender.Send(command, cancellationToken);
        
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

public sealed record ReconcilePaymentSessionRequest(string CashierId, string Remarks);
public sealed record CreatePaymentSessionRequest(string InvoiceId, string ApplicantId, decimal Amount, string Purpose);

