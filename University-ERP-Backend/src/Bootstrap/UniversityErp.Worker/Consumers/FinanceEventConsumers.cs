namespace UniversityErp.Worker.Consumers;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Contracts.IntegrationEvents.Administration;
using Microsoft.Extensions.Logging;

/// <summary>
/// Handles Finance-related integration events received asynchronously by the background worker.
/// </summary>
public sealed class InvoiceIssuedEventConsumer : INotificationHandler<InvoiceIssuedIntegrationEvent>
{
    private readonly ILogger<InvoiceIssuedEventConsumer> _logger;

    public InvoiceIssuedEventConsumer(ILogger<InvoiceIssuedEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Handle(InvoiceIssuedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing InvoiceIssuedIntegrationEvent for Invoice {InvoiceId}, Student {StudentId}, Amount {Amount}",
            notification.InvoiceId, notification.StudentId, notification.Amount);

        // Additional worker logic: trigger notifications, update BI analytics, etc.

        return Task.CompletedTask;
    }
}

public sealed class PayrollCalculatedEventConsumer : INotificationHandler<PayrollCalculatedIntegrationEvent>
{
    private readonly ILogger<PayrollCalculatedEventConsumer> _logger;

    public PayrollCalculatedEventConsumer(ILogger<PayrollCalculatedEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Handle(PayrollCalculatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing PayrollCalculatedIntegrationEvent for Batch {PayrollBatchId}, Total Employees {Count}, Total Amount {Amount}",
            notification.PayrollBatchId, notification.TotalEmployeesProcessed, notification.TotalDisbursementAmount);

        return Task.CompletedTask;
    }
}

