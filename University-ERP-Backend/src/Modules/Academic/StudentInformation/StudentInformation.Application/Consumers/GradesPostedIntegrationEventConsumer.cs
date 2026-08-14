namespace StudentInformation.Application.Consumers;

using MediatR;
using Contracts.IntegrationEvents.Academic;
using StudentInformation.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public sealed class GradesPostedIntegrationEventConsumer : INotificationHandler<GradesPostedIntegrationEvent>
{
    private readonly IStudentAcademicRecordRepository _repository;
    private readonly ILogger<GradesPostedIntegrationEventConsumer> _logger;

    public GradesPostedIntegrationEventConsumer(
        IStudentAcademicRecordRepository repository, 
        ILogger<GradesPostedIntegrationEventConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Handle(GradesPostedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Grades posted for section {SectionId}. Recalculating GPAs for {Count} students.", 
            notification.SectionId, notification.StudentFinalGrades.Count);

        foreach (var gradeEntry in notification.StudentFinalGrades)
        {
            var studentId = gradeEntry.Key;
            var finalGrade = gradeEntry.Value;

            var academicRecord = await _repository.GetByStudentIdAsync(studentId, cancellationToken);
            
            if (academicRecord != null)
            {
                // This domain method applies the new grade and recalculates the Cumulative GPA
                academicRecord.RecordGradeAndComputeGpa(notification.SectionId, finalGrade);
                await _repository.UpdateAsync(academicRecord, cancellationToken);
            }
        }
    }
}
