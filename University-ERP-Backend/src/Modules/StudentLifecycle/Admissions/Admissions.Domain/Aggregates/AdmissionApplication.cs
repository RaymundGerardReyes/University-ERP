namespace Admissions.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using Admissions.Domain.Entities;

public sealed class AdmissionApplication : AggregateRoot<string>
{
    public string ApplicantId { get; private set; } = string.Empty;
    public string ProgramId { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime SubmittedDate { get; private set; }
    
    private readonly List<AdmissionDocument> _documents = new();
    public IReadOnlyCollection<AdmissionDocument> Documents => _documents.AsReadOnly();

    private readonly List<ApplicationTimelineEvent> _timelineEvents = new();
    public IReadOnlyCollection<ApplicationTimelineEvent> TimelineEvents => _timelineEvents.AsReadOnly();

    private AdmissionApplication() : base() { }

    public AdmissionApplication(string id, string applicantId, string programId)
        : base(id)
    {
        ApplicantId = applicantId;
        ProgramId = programId;
        Status = "Submitted";
        SubmittedDate = DateTime.UtcNow;

        // Initialize default timeline
        AddTimelineEvent("Application Submitted", "Your application has been received.", "Completed", DateTime.UtcNow);
        AddTimelineEvent("Document Verification", "We are verifying your uploaded documents.", "Active");
        AddTimelineEvent("Under Review", "Your application is being reviewed by the admissions committee.", "Locked");
        AddTimelineEvent("Admission Decision", "Final decision on your application.", "Locked");
    }

    public void AddDocument(string name, string status)
    {
        var doc = new AdmissionDocument(Guid.NewGuid().ToString(), Id, name, status);
        _documents.Add(doc);
    }

    public void AddTimelineEvent(string title, string description, string status, DateTime? dateCompleted = null)
    {
        var evt = new ApplicationTimelineEvent(Guid.NewGuid().ToString(), Id, title, description, status, dateCompleted);
        _timelineEvents.Add(evt);
    }

    public void UpdateStatus(string status)
    {
        Status = status;
    }
}