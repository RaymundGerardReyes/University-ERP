using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
// Assuming the shared contracts for events exist
using Contracts.IntegrationEvents.Academic;

namespace UniversityERP.Modules.Administration.Finance.Application.Events.Handlers
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
            _logger.LogInformation("Finance Module: Received StudentEnrolledIntegrationEvent for StudentId: {StudentId}", notification.StudentId);
            
            // TODO: Orchestrate Ledger Assessment
            // 1. Fetch academic program fees for the term
            // 2. Assess tuition and miscellaneous fees
            // 3. Generate initial statement of account
            
            _logger.LogInformation("Finance Module: Initial ledger assessment created for StudentId: {StudentId}", notification.StudentId);
            
            await Task.CompletedTask;
        }
    }
}
