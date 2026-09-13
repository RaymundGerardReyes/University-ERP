namespace Finance.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.StudentLifecycle;
using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

public sealed class ApplicantAcceptedIntegrationEventConsumer : INotificationHandler<ApplicantAcceptedIntegrationEvent>
{
    private readonly IStudentBillingRepository _studentBillingRepository;
    private readonly ILogger<ApplicantAcceptedIntegrationEventConsumer> _logger;

    public ApplicantAcceptedIntegrationEventConsumer(
        IStudentBillingRepository studentBillingRepository,
        ILogger<ApplicantAcceptedIntegrationEventConsumer> logger)
    {
        _studentBillingRepository = studentBillingRepository;
        _logger = logger;
    }

    public async Task Handle(ApplicantAcceptedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Finance Module intercepted applicant endorsement for Applicant {ApplicantId}, Program {Program}",
            notification.ApplicantId, notification.TargetProgramCode);

        // Derive or parse a stable Guid for the applicant
        Guid applicantGuid = Guid.TryParse(notification.ApplicantId, out var parsedGuid)
            ? parsedGuid
            : GenerateDeterministicGuid(notification.ApplicantId);

        var existingBilling = await _studentBillingRepository.GetByStudentIdAsync(applicantGuid, cancellationToken);
        if (existingBilling != null)
        {
            _logger.LogInformation("Billing record already exists for applicant {ApplicantId}", notification.ApplicantId);
            return;
        }

        var description = $"Admissions Assessment ({notification.TargetProgramCode}) - {notification.AcademicYear}";
        var billingResult = StudentBilling.IssueInvoice(applicantGuid, 3500.00m, description);

        if (billingResult.IsSuccess)
        {
            await _studentBillingRepository.AddAsync(billingResult.Value, cancellationToken);
            _logger.LogInformation("Generated initial admission assessment billing {BillingId} for applicant {ApplicantId}",
                billingResult.Value.Id, notification.ApplicantId);
        }
        else
        {
            _logger.LogWarning("Failed to create billing record: {Error}", billingResult.Error.Description);
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

