namespace IdentityAccess.Application.EventHandlers.IntegrationEventHandlers;

using MediatR;
using Contracts.IntegrationEvents.StudentLifecycle;
using IdentityAccess.Application.Features.RegisterUser;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public sealed class StudentEnrolledIntegrationEventConsumer : INotificationHandler<StudentEnrolledIntegrationEvent>
{
    private readonly ISender _sender;
    private readonly ILogger<StudentEnrolledIntegrationEventConsumer> _logger;

    public StudentEnrolledIntegrationEventConsumer(ISender sender, ILogger<StudentEnrolledIntegrationEventConsumer> logger)
    {
        _sender = sender;
        _logger = logger;
    }

    public async Task Handle(StudentEnrolledIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Auto-provisioning Identity for newly enrolled student: {StudentId}", notification.GeneratedStudentId);

        // Generate a standard university email based on the new Student ID
        var institutionalEmail = $"student.{notification.GeneratedStudentId.ToLower()}@university.edu";

        // Dispatch the existing CQRS command to register the user securely
        var command = new RegisterUserCommand(
            institutionalEmail, 
            "New", 
            "Student", 
            "Welcome@2026!" // Default secure password
        );

        // This command internally hashes the password and publishes the UserRegisteredIntegrationEvent
        await _sender.Send(command, cancellationToken);
    }
}
