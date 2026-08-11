namespace Finance.Presentation.Endpoints;

using Finance.Application.Features.PaymentSessions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/webhooks/banking")]
public sealed class BankingCallbackEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public BankingCallbackEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> HandleCallback([FromBody] BankingCallbackPayload payload, CancellationToken cancellationToken)
    {
        // Note: In production, there must be signature validation (e.g., HMAC-SHA256) here
        // to verify the payload genuinely originated from the Banking System.

        if (string.IsNullOrWhiteSpace(payload.ReferenceId) || string.IsNullOrWhiteSpace(payload.BankReference))
        {
            return BadRequest(new { code = "InvalidPayload", message = "Missing required callback identifiers." });
        }

        var command = new ProcessBankingCallbackCommand(
            payload.ReferenceId, 
            payload.BankReference, 
            payload.Status,
            payload.Amount);

        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() // 200 OK acknowledges receipt to the webhook sender
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public class BankingCallbackPayload
{
    public string ReferenceId { get; set; } = string.Empty; // SessionId
    public string BankReference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
