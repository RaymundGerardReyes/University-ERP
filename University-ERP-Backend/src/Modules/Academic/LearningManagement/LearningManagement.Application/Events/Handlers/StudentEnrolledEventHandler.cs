using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
// Assuming the shared contracts for events exist
using Contracts.IntegrationEvents.Academic;

namespace UniversityERP.Modules.Academic.LearningManagement.Application.Events.Handlers
{
    public class StudentEnrolledEventHandler : INotificationHandler<StudentEnrolledIntegrationEvent>
    {
        private readonly ILogger<StudentEnrolledEventHandler> _logger;

        public StudentEnrolledEventHandler(ILogger<StudentEnrolledEventHandler> logger)
        {
            _logger = logger;
        }

        public async Task Handle(StudentEnrolledIntegrationEvent notification, CancellationToken cancellationToken)
        {
            _logger.LogInformation("LMS Module: Received StudentEnrolledIntegrationEvent for StudentId: {StudentId}", notification.StudentId);
            
            // TODO: Orchestrate LMS Provisioning
            // 1. Check if LMS Account exists, if not create one via Canvas/Moodle API
            // 2. Auto-enroll student into the mandatory orientation modules
            // 3. Send welcome email with LMS credentials
            
            _logger.LogInformation("LMS Module: LMS account provisioned successfully for StudentId: {StudentId}", notification.StudentId);
            
            await Task.CompletedTask;
        }
    }
}
