namespace Admissions.Application.Features.PayApplicationFee;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record PayApplicationFeeCommand(
    string ApplicationId, 
    string TransactionId
) : IRequest<Result<bool>>;

public sealed class PayApplicationFeeCommandHandler : IRequestHandler<PayApplicationFeeCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;
    private readonly IPublisher? _publisher;

    public PayApplicationFeeCommandHandler(IAdmissionApplicationRepository repository, IPublisher? publisher = null)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(PayApplicationFeeCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var result = application.MarkFeeAsPaid(request.TransactionId);

        if (result.IsFailure)
            return result;

        await _repository.SaveChangesAsync(cancellationToken);

        if (_publisher != null)
        {
            var paymentEvent = new Contracts.IntegrationEvents.Administration.PaymentVerifiedIntegrationEvent(
                System.Guid.NewGuid(),
                System.DateTime.UtcNow,
                application.ApplicantId ?? application.Id,
                application.Id,
                500.00m,
                "PHP",
                request.TransactionId,
                System.DateTime.UtcNow
            );
            await _publisher.Publish(paymentEvent, cancellationToken);
        }

        return Result<bool>.Success(true);
    }
}
