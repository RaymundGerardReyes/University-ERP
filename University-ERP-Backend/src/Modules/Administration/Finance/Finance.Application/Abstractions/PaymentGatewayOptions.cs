namespace Finance.Application.Abstractions;

public class PaymentGatewayOptions
{
    public string SecretKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string SuccessUrl { get; set; } = string.Empty;
    public string CancelUrl { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.paymongo.com";
}
