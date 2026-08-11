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
    
    // --- NEW PROPERTIES ---
    public string InterviewDate { get; private set; } = string.Empty;
    public string InterviewTime { get; private set; } = string.Empty;
    
    public string ApplicationFeeStatus { get; private set; } = "Pending";
    public string? ApplicationFeeTransactionId { get; private set; }

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

        // Initialize default required documents
        AddDocument("Birth Certificate (PSA)", "Pending");
        AddDocument("Form 137 / Transcript of Records", "Pending");
        AddDocument("Good Moral Certificate", "Pending");
    }

    public void AddDocument(string name, string status, string? filePath = null)
    {
        var doc = new AdmissionDocument(Guid.NewGuid().ToString(), Id, name, status);
        if (status == "Uploaded")
        {
            doc.MarkAsUploaded(filePath);
        }
        _documents.Add(doc);
    }

    public void AddTimelineEvent(string title, string description, string status, DateTime? dateCompleted = null)
    {
        var evt = new ApplicationTimelineEvent(Guid.NewGuid().ToString(), Id, title, description, status, dateCompleted);
        _timelineEvents.Add(evt);
    }

    // --- NEW DOMAIN METHOD ---
    public Result<bool> MarkFeeAsPaid(string transactionId)
    {
        if (ApplicationFeeStatus == "Paid")
        {
            return Result<bool>.Failure(new Error("Admissions.FeeAlreadyPaid", "The application fee has already been paid."));
        }

        ApplicationFeeStatus = "Paid";
        ApplicationFeeTransactionId = transactionId;
        
        AddTimelineEvent("Application Fee Paid", $"Payment confirmed. Transaction ID: {transactionId}", "Completed", DateTime.UtcNow);

        return Result<bool>.Success(true);
    }

    public Result<bool> VerifyDocuments()
    {
        if (Status != "Submitted") return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application is not in Submitted state."));
        Status = "InterviewPending";
        AddTimelineEvent("Document Verification Complete", "Documents have been verified by Admissions.", "Completed", DateTime.UtcNow);
        return Result<bool>.Success(true);
    }

    // --- NEW DOMAIN METHOD ---
    public Result<bool> ScheduleInterview(string date, string time)
    {
        if (Status != "InterviewPending" && Status != "Submitted" && Status != "Under Review") 
            return Result<bool>.Failure(new Error("Admissions.InvalidState", "Application is not ready for interview scheduling."));

        InterviewDate = date;
        InterviewTime = time;
        Status = "InterviewScheduled";
        
        AddTimelineEvent("Interview Scheduled", $"Your interview is scheduled for {date} at {time}.", "Completed", DateTime.UtcNow);

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