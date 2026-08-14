namespace StudentInformation.Application.Consumers;

using MediatR;
using IdentityAccess.Contracts.IntegrationEvents;
using StudentInformation.Application.Abstractions;
using StudentInformation.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class UserRegisteredIntegrationEventConsumer : INotificationHandler<UserRegisteredIntegrationEvent>
{
    private readonly IStudentAcademicRecordRepository _repository;

    public UserRegisteredIntegrationEventConsumer(IStudentAcademicRecordRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(UserRegisteredIntegrationEvent notification, CancellationToken cancellationToken)
    {
        // Only process students (filter by the email domain we generated in Phase 2)
        if (notification.Email.StartsWith("student.", StringComparison.OrdinalIgnoreCase))
        {
            // Extract the enrollment number from the email (e.g., "student.stu-2026-1234@university.edu")
            var enrollmentNumber = notification.Email.Split('@')[0].Replace("student.", "", StringComparison.OrdinalIgnoreCase).ToUpper();

            // Create the official Academic Student aggregate
            var record = new StudentAcademicRecord(Guid.NewGuid(), enrollmentNumber);

            await _repository.AddAsync(record, cancellationToken);
        }
    }
}
