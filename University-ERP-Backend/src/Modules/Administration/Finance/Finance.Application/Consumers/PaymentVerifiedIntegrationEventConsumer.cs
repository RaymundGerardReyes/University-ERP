namespace Finance.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.Administration;
using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

public sealed class PaymentVerifiedIntegrationEventConsumer : INotificationHandler<PaymentVerifiedIntegrationEvent>
{
    private readonly IStudentBillingRepository _studentBillingRepository;
    private readonly ILogger<PaymentVerifiedIntegrationEventConsumer> _logger;

    public PaymentVerifiedIntegrationEventConsumer(
        IStudentBillingRepository studentBillingRepository,
        ILogger<PaymentVerifiedIntegrationEventConsumer> logger)
    {
        _studentBillingRepository = studentBillingRepository;
        _logger = logger;
    }

    public async Task Handle(PaymentVerifiedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Finance Module intercepted PaymentVerifiedIntegrationEvent for Applicant {ApplicantId}, Amount {Amount}",
            notification.ApplicantId, notification.AmountPaid);

        StudentBilling? billing = null;

        // 1. Try resolving by InvoiceId
        if (!string.IsNullOrWhiteSpace(notification.InvoiceId))
        {
            var rawInvoiceId = notification.InvoiceId.Replace("INV-", "");
            if (Guid.TryParse(rawInvoiceId, out var invoiceGuid))
            {
                billing = await _studentBillingRepository.GetByIdAsync(invoiceGuid, cancellationToken);
            }
        }

        // 2. Try resolving by ApplicantId (Guid or Deterministic Guid)
        if (billing == null && !string.IsNullOrWhiteSpace(notification.ApplicantId))
        {
            Guid applicantGuid = Guid.TryParse(notification.ApplicantId, out var parsedGuid)
                ? parsedGuid
                : GenerateDeterministicGuid(notification.ApplicantId);

            billing = await _studentBillingRepository.GetByStudentIdAsync(applicantGuid, cancellationToken);
        }

        if (billing != null)
        {
            billing.RecordPayment(notification.AmountPaid);
            await _studentBillingRepository.UpdateAsync(billing, cancellationToken);
            _logger.LogInformation("Successfully updated StudentBilling {BillingId} with verified payment of {Amount}. Current Status: {Status}",
                billing.Id, notification.AmountPaid, billing.Status);
        }
        else
        {
            _logger.LogWarning("No existing StudentBilling found for Applicant {ApplicantId} or Invoice {InvoiceId}",
                notification.ApplicantId, notification.InvoiceId);
        }
    }

    private static Guid GenerateDeterministicGuid(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return Guid.NewGuid();
        using var md5 = MD5.Create();
        var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
        return new Guid(hash);
    }
}

