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
        var applications = await _repository.GetByApplicantIdAsync(notification.ApplicantId.ToString(), cancellationToken);
        var application = applications.FirstOrDefault(a => a.ApplicationFeeStatus != "Paid");

        if (application != null)
        {
            var result = application.MarkFeeAsPaid(notification.PaymentReference);
            if (result.IsSuccess)
            {
                await _repository.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
