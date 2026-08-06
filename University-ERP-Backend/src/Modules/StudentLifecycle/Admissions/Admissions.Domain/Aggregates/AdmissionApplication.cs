namespace Admissions.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using Admissions.Domain.Entities;
using Admissions.Domain.Events;

public sealed class AdmissionApplication : AggregateRoot<string>
{
    public string ApplicantId { get; private set; } = string.Empty;
    public string ProgramId { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public string FacultyRemarks { get; private set; } = string.Empty;
    public string OfficialStudentId { get; private set; } = string.Empty;
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

    public Result<bool> VerifyDocuments()
    {
        if (Status != "Submitted") return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application is not in Submitted state."));
        Status = "InterviewPending";
        AddTimelineEvent("Document Verification Complete", "Documents have been verified by Admissions.", "Completed", DateTime.UtcNow);
        return Result<bool>.Success(true);
    }

    public Result<bool> CompleteInterview(string remarks)
    {
        if (Status != "InterviewPending") return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application is not in InterviewPending state."));
        Status = "UnderAcademicEvaluation";
        FacultyRemarks = remarks;
        AddTimelineEvent("Interview Completed", "Interview passed. Pending academic evaluation.", "Completed", DateTime.UtcNow);
        return Result<bool>.Success(true);
    }

    public Result<bool> Recommend(string remarks)
    {
        if (Status != "UnderAcademicEvaluation") return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application must be under academic evaluation."));
        Status = "Recommended";
        FacultyRemarks = remarks;
        AddTimelineEvent("Chairperson Recommendation", "Program Chairperson has recommended admission.", "Completed", DateTime.UtcNow);
        return Result<bool>.Success(true);
    }

    public Result<bool> Endorse()
    {
        if (Status != "Recommended") return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application must be recommended by the Chairperson first."));
        Status = "Endorsed_For_Enrollment";
        AddTimelineEvent("Dean Endorsement", "College Dean has endorsed this applicant for official enrollment.", "Completed", DateTime.UtcNow);
        return Result<bool>.Success(true);
    }

    public Result<bool> ActivateEnrollment(string generatedStudentId)
    {
        if (Status != "Endorsed_For_Enrollment") return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application must be endorsed by the Dean before the Registrar can activate it."));
        Status = "Enrolled";
        OfficialStudentId = generatedStudentId;
        AddTimelineEvent("Official Enrollment Activated", $"Registrar has activated enrollment. Student ID: {generatedStudentId}", "Completed", DateTime.UtcNow);
        
        RaiseDomainEvent(new StudentEnrolledDomainEvent(Guid.NewGuid(), DateTime.UtcNow, Id, generatedStudentId, DateTime.UtcNow));
        return Result<bool>.Success(true);
    }

    public void UpdateStatus(string newStatus)
    {
        Status = newStatus;
    }
}