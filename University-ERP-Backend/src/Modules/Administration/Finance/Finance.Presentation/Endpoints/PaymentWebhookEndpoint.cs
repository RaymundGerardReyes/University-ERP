namespace Finance.Presentation.Endpoints;

using Finance.Application.Abstractions;
using Finance.Application.Features.PaymentSessions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/webhooks")]
public sealed class PaymentWebhookEndpoint : ControllerBase
{
    private readonly ISender _sender;
    private readonly PaymentGatewayOptions _options;

    public PaymentWebhookEndpoint(ISender sender, IOptions<PaymentGatewayOptions> options)
    {
        _sender = sender;
        _options = options.Value;
    }

    [HttpPost("paymongo")]
    public async Task<IActionResult> Webhook(CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync(cancellationToken);

        if (!Request.Headers.TryGetValue("Paymongo-Signature", out var signatureHeader))
        {
            return BadRequest(new { error = "Missing signature header." });
        }

        var signatureString = signatureHeader.ToString();
        var (t, te, li) = ParseSignature(signatureString);

        if (string.IsNullOrEmpty(t))
        {
            return BadRequest(new { error = "Invalid signature format." });
        }

        if (!VerifySignature(t, rawBody, te, li, _options.WebhookSecret))
        {
            return Unauthorized(new { error = "Invalid webhook signature." });
        }

        try
        {
            using var document = JsonDocument.Parse(rawBody);
            var root = document.RootElement;
            
            var eventType = root.GetProperty("data").GetProperty("attributes").GetProperty("type").GetString();
            
            if (eventType == "checkout_session.payment.paid")
            {
                var checkoutSession = root.GetProperty("data").GetProperty("attributes").GetProperty("data").GetProperty("attributes");
                var referenceNumber = checkoutSession.GetProperty("reference_number").GetString();
                
                if (!string.IsNullOrEmpty(referenceNumber))
                {
                    // The reference_number is our SessionId
                    var completeCommand = new CompletePaymentSessionCommand(referenceNumber);
                    var completeResult = await _sender.Send(completeCommand, cancellationToken);
                    
                    if (completeResult.IsFailure)
                    {
                        // In a real system, we'd log this and possibly return 200 to prevent retries if it's already paid
                        if (completeResult.Error.Code == "PaymentSession.AlreadyPaid")
                            return Ok();
                            
                        return BadRequest(new { error = completeResult.Error.Description });
                    }
                }
            }
            
            return Ok(new { received = true });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Failed to process webhook.", details = ex.Message });
        }
    }

    private (string t, string te, string li) ParseSignature(string header)
    {
        string t = string.Empty, te = string.Empty, li = string.Empty;
        var parts = header.Split(',');
        
        foreach (var part in parts)
        {
            var kv = part.Split('=', 2);
            if (kv.Length == 2)
            {
                var key = kv[0].Trim();
                var value = kv[1].Trim();
                
                if (key == "t") t = value;
                else if (key == "te") te = value;
                else if (key == "li") li = value;
            }
        }
        
        return (t, te, li);
    }

    private bool VerifySignature(string timestamp, string rawBody, string te, string li, string secret)
    {
        // Mock fallback for local dev when secrets aren't set
        if (secret == "whsec_mocked") return true;

        var signedPayload = $"{timestamp}.{rawBody}";
        
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedPayload));
        var calculatedSignature = Convert.ToHexString(hash).ToLowerInvariant();

        // Compare against test or live depending on what's available
        var targetSignature = !string.IsNullOrEmpty(te) ? te : li;
        
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(calculatedSignature),
            Encoding.UTF8.GetBytes(targetSignature)
        );
    }
}
