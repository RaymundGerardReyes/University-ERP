namespace Examination.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;

/// <summary>
/// Tracks live proctoring, invigilator assignments, and incident logging during an examination.
/// </summary>
public sealed class ExamSession : AggregateRoot<Guid>
{
    public Guid AssessmentId { get; private set; }
    public string RoomNumber { get; private set; } = string.Empty;
    public Guid InvigilatorId { get; private set; }
    public DateTime StartTimeUtc { get; private set; }
    
    private readonly List<string> _incidents = new();
    public IReadOnlyCollection<string> Incidents => _incidents.AsReadOnly();

    private ExamSession() { }

    private ExamSession(Guid id, Guid assessmentId, string roomNumber, Guid invigilatorId, DateTime startTime) : base(id)
    {
        AssessmentId = assessmentId;
        RoomNumber = roomNumber;
        InvigilatorId = invigilatorId;
        StartTimeUtc = startTime;
    }

    public static Result<ExamSession> Create(Guid assessmentId, string roomNumber, Guid invigilatorId, DateTime startTime)
    {
        return Result<ExamSession>.Success(new ExamSession(Guid.NewGuid(), assessmentId, roomNumber, invigilatorId, startTime));
    }

    public void LogProctoringIncident(string incidentDescription)
    {
        if (!string.IsNullOrWhiteSpace(incidentDescription))
        {
            _incidents.Add($"[{DateTime.UtcNow:O}] {incidentDescription}");
        }
    }
}