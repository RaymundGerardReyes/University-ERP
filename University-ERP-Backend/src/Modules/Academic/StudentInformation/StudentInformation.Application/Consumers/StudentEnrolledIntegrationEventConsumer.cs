namespace StudentInformation.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.StudentLifecycle;
using StudentInformation.Application.Abstractions;
using StudentInformation.Domain.Aggregates;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class StudentEnrolledIntegrationEventConsumer : INotificationHandler<StudentEnrolledIntegrationEvent>
{
    private readonly IStudentAcademicRecordRepository _repository;
    private readonly ILogger<StudentEnrolledIntegrationEventConsumer> _logger;

    public StudentEnrolledIntegrationEventConsumer(
        IStudentAcademicRecordRepository repository,
        ILogger<StudentEnrolledIntegrationEventConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Handle(StudentEnrolledIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("StudentInformation Module intercepted official enrollment. Provisioning Academic Record for Student {StudentId}",
            notification.GeneratedStudentId);

        var existing = await _repository.GetByStudentIdAsync(notification.GeneratedStudentId, cancellationToken);
        if (existing != null)
        {
            _logger.LogInformation("Academic Record already exists for student {StudentId}", notification.GeneratedStudentId);
            return;
        }

        var record = new StudentAcademicRecord(Guid.NewGuid(), notification.GeneratedStudentId);

        // Populate initial semester course records for the incoming freshman / transfer student
        record.AddCourseRecord($"SEC-{notification.GeneratedStudentId}-101", "CS-101", 3);
        record.AddCourseRecord($"SEC-{notification.GeneratedStudentId}-102", "MATH-101", 4);
        record.AddCourseRecord($"SEC-{notification.GeneratedStudentId}-103", "ENG-101", 3);

        await _repository.AddAsync(record, cancellationToken);

        _logger.LogInformation("Successfully provisioned academic record {RecordId} for student {StudentId}",
            record.Id, notification.GeneratedStudentId);
    }
}

