namespace Admissions.Application.Consumers;

using Contracts.IntegrationEvents.Administration;
using MediatR;
using Admissions.Application.Abstractions;
using SharedKernel.Domain.Primitives;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

public sealed class PaymentVerifiedIntegrationEventConsumer : INotificationHandler<PaymentVerifiedIntegrationEvent>
{
    private readonly IAdmissionApplicationRepository _repository;

    public PaymentVerifiedIntegrationEventConsumer(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(PaymentVerifiedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        Admissions.Domain.Aggregates.AdmissionApplication? application = null;

        // 1. Primary lookup: Try InvoiceId (which maps to ApplicationId in payment sessions)
        if (!string.IsNullOrWhiteSpace(notification.InvoiceId))
        {
            application = await _repository.GetByIdAsync(notification.InvoiceId, cancellationToken);
        }

        // 2. Secondary lookup: Try ApplicantId
        if (application == null && !string.IsNullOrWhiteSpace(notification.ApplicantId))
        {
            var applications = await _repository.GetByApplicantIdAsync(notification.ApplicantId, cancellationToken);
            application = applications.FirstOrDefault(a => a.ApplicationFeeStatus != "Paid") 
                          ?? applications.FirstOrDefault();
        }

        // 3. Fallback lookup: Try ApplicantId as ApplicationId
        if (application == null && !string.IsNullOrWhiteSpace(notification.ApplicantId))
        {
            application = await _repository.GetByIdAsync(notification.ApplicantId, cancellationToken);
        }

        if (application != null && application.ApplicationFeeStatus != "Paid")
        {
            var result = application.MarkFeeAsPaid(notification.PaymentReference);
            if (result.IsSuccess)
            {
                await _repository.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
