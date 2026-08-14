namespace StudentInformation.Application.Consumers;

using MediatR;
using IdentityAccess.Contracts.IntegrationEvents;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Infrastructure.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class UserRegisteredIntegrationEventConsumer : INotificationHandler<UserRegisteredIntegrationEvent>
{
    private readonly StudentInformationDbContext _dbContext;

    public UserRegisteredIntegrationEventConsumer(StudentInformationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(UserRegisteredIntegrationEvent notification, CancellationToken cancellationToken)
    {
        // Only process students (filter by the email domain we generated in Phase 2)
        if (notification.Email.StartsWith("student.", StringComparison.OrdinalIgnoreCase))
        {
            // Extract the enrollment number from the email (e.g., "student.stu-2026-1234@university.edu")
            var enrollmentNumber = notification.Email.Split('@')[0].Replace("student.", "", StringComparison.OrdinalIgnoreCase).ToUpper();

            // Create the official Academic Student aggregate using the factory method
            var studentResult = Student.Enroll(
                StudentId.Create(Guid.NewGuid()),
                notification.UserId,
                enrollmentNumber,
                DateTime.UtcNow
            );

            if (studentResult.IsSuccess)
            {
                _dbContext.Students.Add(studentResult.Value);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
