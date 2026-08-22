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

    [HttpPost("banking")]
    public async Task<IActionResult> Webhook(CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync(cancellationToken);

        // Accept standard Bank headers
        Request.Headers.TryGetValue("X-Bank-Signature", out var bankSignatureHeader);
        Request.Headers.TryGetValue("X-Bank-Timestamp", out var bankTimestampHeader);

        string signatureString = bankSignatureHeader.ToString();
        string timestampString = bankTimestampHeader.ToString();

        if (string.IsNullOrEmpty(signatureString))
        {
            return BadRequest(new { error = "Missing signature header." });
        }

        if (!VerifyNovaBankSignature(timestampString, rawBody, signatureString, _options.WebhookSecret))
        {
            return Unauthorized(new { error = "Invalid webhook signature." });
        }

        try
        {
            using var document = JsonDocument.Parse(rawBody);
            var root = document.RootElement;
            
            // Extract event type resiliently
            string eventType = string.Empty;
            if (root.TryGetProperty("eventType", out var etProp)) eventType = etProp.GetString() ?? string.Empty;
            else if (root.TryGetProperty("data", out var data) && data.TryGetProperty("attributes", out var attr) && attr.TryGetProperty("type", out var typeProp)) eventType = typeProp.GetString() ?? string.Empty;
            
            // Supported success events
            if (eventType == "PAYMENT_COMPLETED" || eventType == "payment_intent.succeeded" || eventType == "checkout_session.payment.paid" || eventType == "TRANSFER_COMPLETED")
            {
                string? referenceNumber = ExtractReferenceNumber(root);
                
                if (!string.IsNullOrEmpty(referenceNumber))
                {
                    // The reference_number maps to our SessionId
                    var completeCommand = new CompletePaymentSessionCommand(referenceNumber);
                    var completeResult = await _sender.Send(completeCommand, cancellationToken);
                    
                    if (completeResult.IsFailure)
                    {
                        if (completeResult.Error.Code == "PaymentSession.AlreadyPaid")
                            return Ok(new { received = true, status = "already_processed" });
                            
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

    private string? ExtractReferenceNumber(JsonElement root)
    {
        if (root.TryGetProperty("transactionReference", out var trProp)) return trProp.GetString();
        if (root.TryGetProperty("merchantReference", out var mrProp)) return mrProp.GetString();
        
        // Deep traversal fallback for wrapped attributes
        if (root.TryGetProperty("data", out var data) && 
            data.TryGetProperty("attributes", out var attr) && 
            attr.TryGetProperty("data", out var innerData) && 
            innerData.TryGetProperty("attributes", out var innerAttr) && 
            innerAttr.TryGetProperty("reference_number", out var refNum))
        {
            return refNum.GetString();
        }
        
        return null;
    }


    private bool VerifyNovaBankSignature(string timestamp, string rawBody, string providedSignature, string secret)
    {
        // Mock fallback for local dev when secrets aren't set
        if (secret == "whsec_mocked") return true;

        var signedPayload = string.IsNullOrEmpty(timestamp) ? rawBody : $"{timestamp}.{rawBody}";
        
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedPayload));
        
        // Check both Base64 (NovaBank style) and Hex (PayMongo style)
        var calculatedBase64 = Convert.ToBase64String(hash);
        var calculatedHex = Convert.ToHexString(hash).ToLowerInvariant();

        return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(calculatedBase64), Encoding.UTF8.GetBytes(providedSignature)) ||
               CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(calculatedHex), Encoding.UTF8.GetBytes(providedSignature));
    }
}
