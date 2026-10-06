namespace Finance.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.StudentLifecycle;
using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

public sealed class RoomAllocatedIntegrationEventConsumer : INotificationHandler<RoomAllocatedIntegrationEvent>
{
    private readonly IStudentBillingRepository _studentBillingRepository;
    private readonly ILogger<RoomAllocatedIntegrationEventConsumer> _logger;

    public RoomAllocatedIntegrationEventConsumer(
        IStudentBillingRepository studentBillingRepository,
        ILogger<RoomAllocatedIntegrationEventConsumer> logger)
    {
        _studentBillingRepository = studentBillingRepository;
        _logger = logger;
    }

    public async Task Handle(RoomAllocatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Finance Module intercepted RoomAllocatedIntegrationEvent for student {StudentId}, room {Hostel} {Room}, fee: {Fee}",
            notification.StudentId, notification.HostelName, notification.RoomNumber, notification.MonthlyFee);

        var existingBilling = await _studentBillingRepository.GetByStudentIdAsync(notification.StudentId, cancellationToken);

        if (existingBilling != null)
        {
            var assessResult = existingBilling.AssessTuition(notification.MonthlyFee);
            if (assessResult.IsSuccess)
            {
                await _studentBillingRepository.UpdateAsync(existingBilling, cancellationToken);
                _logger.LogInformation("Assessed hostel accommodation fee {Fee} to existing ledger for student {StudentId}",
                    notification.MonthlyFee, notification.StudentId);
            }
            else
            {
                _logger.LogWarning("Failed to assess hostel fee to existing billing: {Error}", assessResult.Error.Description);
            }
        }
        else
        {
            var description = $"Hostel Accommodation - {notification.HostelName} Room {notification.RoomNumber}";
            var newBillingResult = StudentBilling.IssueInvoice(notification.StudentId, notification.MonthlyFee, description);

            if (newBillingResult.IsSuccess)
            {
                await _studentBillingRepository.AddAsync(newBillingResult.Value, cancellationToken);
                _logger.LogInformation("Created new billing ledger with hostel fee {Fee} for student {StudentId}",
                    notification.MonthlyFee, notification.StudentId);
            }
            else
            {
                _logger.LogWarning("Failed to create billing ledger for hostel fee: {Error}", newBillingResult.Error.Description);
            }
        }
    }
}

