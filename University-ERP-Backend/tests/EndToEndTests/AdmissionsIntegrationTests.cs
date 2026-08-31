using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Admissions.Application.Features.ActivateEnrollment;
using Admissions.Application.Features.ApproveApplication;
using Admissions.Application.Features.CheckEligibility;
using Admissions.Application.Features.CompleteInterview;
using Admissions.Application.Features.EndorseApplication;
using Admissions.Application.Features.EvaluateApplication;
using Admissions.Application.Features.PayApplicationFee;
using Admissions.Application.Features.RecommendAdmission;
using Admissions.Application.Features.ScheduleInterview;
using Admissions.Application.Features.SubmitApplication;
using Admissions.Application.Features.VerifyDocuments;
using Admissions.Application.Features.UploadDocument;
using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;
using Admissions.Infrastructure.Repositories;

namespace UniversityErp.Tests.Integration.Admissions
{
    public class AdmissionsIntegrationTests : IDisposable
    {
        private readonly AdmissionsDbContext _dbContext;
        private readonly AdmissionApplicationRepository _appRepo;
        private readonly ProgramOfferingRepository _programRepo;

        public AdmissionsIntegrationTests()
        {
            var options = new DbContextOptionsBuilder<AdmissionsDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _dbContext = new AdmissionsDbContext(options);
            _appRepo = new AdmissionApplicationRepository(_dbContext);
            _programRepo = new ProgramOfferingRepository(_dbContext);

            // Seed a program offering for testing
            _dbContext.ProgramOfferings.Add(new ProgramOffering("BSCS", "CCS", "BS", "Computer Science", "4 Years", "Fall", "50000"));
            _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        // --- Scenarios 1-3: Submission ---
        [Fact]
        public async Task S01_SubmitApplication_ValidData_CreatesAggregateAndReturnsId()
        {
            var handler = new SubmitApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new SubmitApplicationCommand("APP-001", "BSCS", "John", "Doe", "2000-01-01", "Domestic"), CancellationToken.None);
            
            Assert.NotNull(result);
            var savedApp = await _appRepo.GetByIdAsync(result);
            Assert.Equal("Submitted", savedApp.Status);
        }

        [Fact]
        public async Task S02_SubmitApplication_AddsDefaultRequiredDocuments()
        {
            var handler = new SubmitApplicationCommandHandler(_appRepo);
            var appId = await handler.Handle(new SubmitApplicationCommand("APP-002", "BSCS", "Jane", "Smith", "2001-01-01", "Domestic"), CancellationToken.None);
            
            var savedApp = await _appRepo.GetByIdAsync(appId);
            Assert.Contains(savedApp.Documents, d => d.Name == "Birth Certificate (PSA)");
        }

        [Fact]
        public async Task S03_SubmitApplication_InitializesTimelineEvents()
        {
            var handler = new SubmitApplicationCommandHandler(_appRepo);
            var appId = await handler.Handle(new SubmitApplicationCommand("APP-003", "BSCS", "Tom", "Brown", "2000-05-05", "Domestic"), CancellationToken.None);
            
            var savedApp = await _appRepo.GetByIdAsync(appId);
            Assert.Contains(savedApp.TimelineEvents, t => t.Title == "Application Submitted" && t.Status == "Completed");
        }

        // --- Scenarios 4-6: Document Upload ---
        [Fact]
        public async Task S04_UploadDocument_ValidApplication_MarksAsUploaded()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-004", "BSCS");
            app.AddDocument("Transcript", "Pending");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new UploadDocumentCommandHandler(_appRepo);
            var success = await handler.Handle(new UploadDocumentCommand(app.Id, "Transcript", "/path/file.pdf"), CancellationToken.None);

            Assert.True(success);
            Assert.Equal("Uploaded", app.Documents.First(d => d.Name == "Transcript").Status);
        }

        [Fact]
        public async Task S05_UploadDocument_NewDocumentName_AddsDocumentToCollection()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-005", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new UploadDocumentCommandHandler(_appRepo);
            await handler.Handle(new UploadDocumentCommand(app.Id, "ID_Picture", "/path/pic.jpg"), CancellationToken.None);

            Assert.Contains(app.Documents, d => d.Name == "ID_Picture" && d.Status == "Uploaded");
        }

        [Fact]
        public async Task S06_UploadDocument_InvalidApplicationId_ReturnsFalse()
        {
            var handler = new UploadDocumentCommandHandler(_appRepo);
            var success = await handler.Handle(new UploadDocumentCommand("INVALID-ID", "Doc", "path"), CancellationToken.None);
            Assert.False(success);
        }

        // --- Scenarios 7-9: Document Verification ---
        [Fact]
        public async Task S07_VerifyDocuments_ValidState_TransitionsToInterviewPending()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-100", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new VerifyDocumentsCommandHandler(_appRepo);
            var result = await handler.Handle(new VerifyDocumentsCommand(app.Id), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("InterviewPending", app.Status);
        }

        [Fact]
        public async Task S08_VerifyDocuments_InvalidState_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-101", "BSCS");
            app.UpdateStatus("AlreadyAccepted");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new VerifyDocumentsCommandHandler(_appRepo);
            var result = await handler.Handle(new VerifyDocumentsCommand(app.Id), CancellationToken.None);

            Assert.False(result.IsSuccess);
            Assert.Equal("Admissions.InvalidState", result.Error.Code);
        }

        [Fact]
        public async Task S09_VerifyDocuments_NonExistentApplication_ReturnsNotFoundError()
        {
            var handler = new VerifyDocumentsCommandHandler(_appRepo);
            var result = await handler.Handle(new VerifyDocumentsCommand("FAKE"), CancellationToken.None);
            Assert.False(result.IsSuccess);
            Assert.Equal("Admissions.NotFound", result.Error.Code);
        }

        // --- Scenarios 10-12: Interview Scheduling ---
        [Fact]
        public async Task S10_ScheduleInterview_ValidState_TransitionsToInterviewScheduled()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-200", "BSCS");
            app.VerifyDocuments(); // Move to InterviewPending
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ScheduleInterviewCommandHandler(_appRepo);
            var result = await handler.Handle(new ScheduleInterviewCommand(app.Id, "2026-09-01", "10:00 AM"), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("InterviewScheduled", app.Status);
            Assert.Equal("2026-09-01", app.InterviewDate);
        }

        [Fact]
        public async Task S11_ScheduleInterview_SavesTimelineEventCorrectly()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-201", "BSCS");
            app.VerifyDocuments();
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ScheduleInterviewCommandHandler(_appRepo);
            await handler.Handle(new ScheduleInterviewCommand(app.Id, "2026-09-01", "10:00 AM"), CancellationToken.None);

            Assert.Contains(app.TimelineEvents, t => t.Title == "Interview Scheduled");
        }

        [Fact]
        public async Task S12_ScheduleInterview_InvalidState_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-202", "BSCS");
            app.UpdateStatus("Enrolled"); // Cannot schedule if already enrolled
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ScheduleInterviewCommandHandler(_appRepo);
            var result = await handler.Handle(new ScheduleInterviewCommand(app.Id, "2026-09-01", "10:00 AM"), CancellationToken.None);

            Assert.False(result.IsSuccess);
        }

        // --- Scenarios 13-15: Interview Completion ---
        [Fact]
        public async Task S13_CompleteInterview_TransitionsToUnderAcademicEvaluation()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-300", "BSCS");
            app.VerifyDocuments(); // InterviewPending
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new CompleteInterviewCommandHandler(_appRepo);
            var result = await handler.Handle(new CompleteInterviewCommand(app.Id, "Strong candidate"), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("UnderAcademicEvaluation", app.Status);
        }

        [Fact]
        public async Task S14_CompleteInterview_RecordsFacultyRemarks()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-301", "BSCS");
            app.VerifyDocuments();
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new CompleteInterviewCommandHandler(_appRepo);
            await handler.Handle(new CompleteInterviewCommand(app.Id, "Excellent coding skills"), CancellationToken.None);

            Assert.Equal("Excellent coding skills", app.FacultyRemarks);
        }

        [Fact]
        public async Task S15_CompleteInterview_InvalidState_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-302", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new CompleteInterviewCommandHandler(_appRepo);
            var result = await handler.Handle(new CompleteInterviewCommand(app.Id, "Good"), CancellationToken.None);

            Assert.False(result.IsSuccess);
        }

        // --- Scenarios 16-19: Evaluation Rules ---
        [Theory]
        [InlineData("Accept", "Accepted")]
        [InlineData("Reject", "Rejected")]
        [InlineData("Waitlist", "Waitlist")]
        public async Task S16_to_S18_EvaluateApplication_UpdatesStatusBasedOnDecision(string decision, string expectedStatus)
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-400", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new EvaluateApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new EvaluateApplicationCommand(app.Id, decision, "Reviewed"), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal(expectedStatus, app.Status);
        }

        [Fact]
        public async Task S19_EvaluateApplication_RecordsNotesInTimeline()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-401", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new EvaluateApplicationCommandHandler(_appRepo);
            await handler.Handle(new EvaluateApplicationCommand(app.Id, "Accept", "Great GPA"), CancellationToken.None);

            Assert.Contains(app.TimelineEvents, t => t.Title.Contains("Academic Evaluation") && t.Description == "Great GPA");
        }

        // --- Scenarios 20-23: Recommendation and Endorsement ---
        [Fact]
        public async Task S20_Recommend_ValidState_TransitionsToRecommended()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-500", "BSCS");
            app.UpdateStatus("UnderAcademicEvaluation");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new RecommendAdmissionCommandHandler(_appRepo);
            var result = await handler.Handle(new RecommendAdmissionCommand(app.Id, "Approved by Chair"), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("Recommended", app.Status);
        }

        [Fact]
        public async Task S21_Recommend_InvalidState_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-501", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new RecommendAdmissionCommandHandler(_appRepo);
            var result = await handler.Handle(new RecommendAdmissionCommand(app.Id, "Approved by Chair"), CancellationToken.None);

            Assert.False(result.IsSuccess);
        }

        [Fact]
        public async Task S22_Endorse_ValidState_TransitionsToEndorsed()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-502", "BSCS");
            app.UpdateStatus("Recommended");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new EndorseApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new EndorseApplicationCommand(app.Id), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("Endorsed_For_Enrollment", app.Status);
        }

        [Fact]
        public async Task S23_Endorse_InvalidState_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-503", "BSCS");
            app.UpdateStatus("Submitted");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new EndorseApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new EndorseApplicationCommand(app.Id), CancellationToken.None);

            Assert.False(result.IsSuccess);
        }

        // --- Scenarios 24-26: Enrollment Activation ---
        [Fact]
        public async Task S24_ActivateEnrollment_ValidState_GeneratesOfficialStudentId()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-600", "BSCS");
            app.UpdateStatus("Endorsed_For_Enrollment");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ActivateEnrollmentCommandHandler(_appRepo);
            var result = await handler.Handle(new ActivateEnrollmentCommand(app.Id), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.StartsWith("STU-", result.Value);
            Assert.Equal("Enrolled", app.Status);
        }

        [Fact]
        public async Task S25_ActivateEnrollment_PublishesDomainEvent()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-601", "BSCS");
            app.UpdateStatus("Endorsed_For_Enrollment");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ActivateEnrollmentCommandHandler(_appRepo);
            await handler.Handle(new ActivateEnrollmentCommand(app.Id), CancellationToken.None);

            Assert.NotEmpty(app.GetDomainEvents());
            Assert.Contains(app.GetDomainEvents(), e => e.GetType().Name == "StudentEnrolledDomainEvent");
        }

        [Fact]
        public async Task S26_ActivateEnrollment_InvalidState_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-602", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ActivateEnrollmentCommandHandler(_appRepo);
            var result = await handler.Handle(new ActivateEnrollmentCommand(app.Id), CancellationToken.None);

            Assert.False(result.IsSuccess);
        }

        // --- Scenarios 27-29: Fee Payment ---
        [Fact]
        public async Task S27_PayFee_TransitionsToPaid()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-700", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new PayApplicationFeeCommandHandler(_appRepo);
            var result = await handler.Handle(new PayApplicationFeeCommand(app.Id, "TXN-999"), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("Paid", app.ApplicationFeeStatus);
        }

        [Fact]
        public async Task S28_PayFee_RecordsTransactionId()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-701", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new PayApplicationFeeCommandHandler(_appRepo);
            await handler.Handle(new PayApplicationFeeCommand(app.Id, "TXN-888"), CancellationToken.None);

            Assert.Equal("TXN-888", app.ApplicationFeeTransactionId);
        }

        [Fact]
        public async Task S29_PayFee_AlreadyPaid_ReturnsFailure()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-702", "BSCS");
            app.MarkFeeAsPaid("TXN-111");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new PayApplicationFeeCommandHandler(_appRepo);
            var result = await handler.Handle(new PayApplicationFeeCommand(app.Id, "TXN-222"), CancellationToken.None);

            Assert.False(result.IsSuccess);
            Assert.Equal("Admissions.FeeAlreadyPaid", result.Error.Code);
        }

        // --- Scenarios 30-34: Eligibility Rules (Combinatorial) ---
        [Theory]
        [InlineData("Freshman", 3.5, "Domestic", true, 2)]
        [InlineData("Freshman", 2.5, "Domestic", false, 2)]
        [InlineData("Transfer", 3.8, "Domestic", true, 3)]
        [InlineData("Freshman", 3.2, "International", true, 4)]
        [InlineData("Transfer", 2.1, "International", false, 5)]
        public async Task S30_to_S34_Eligibility_ReturnsCorrectResult(string type, decimal gpa, string country, bool expectedEligibility, int expectedDocCount)
        {
            var handler = new CheckEligibilityQueryHandler();
            var result = await handler.Handle(new CheckEligibilityQuery(type, gpa, country), CancellationToken.None);

            Assert.Equal(expectedEligibility, result.IsEligible);
            Assert.Equal(expectedDocCount, result.RequiredDocuments.Count);
        }

        // --- Scenarios 35-40: Miscellaneous Features & Approvals ---
        [Fact]
        public async Task S35_ApproveApplication_VerifyAction_UpdatesToVerified()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-800", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ApproveApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Verify"), CancellationToken.None);

            Assert.True(result.IsSuccess);
            Assert.Equal("Verified", app.Status);
        }

        [Fact]
        public async Task S36_ApproveApplication_AcceptAction_UpdatesToAccepted()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-801", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ApproveApplicationCommandHandler(_appRepo);
            await handler.Handle(new ApproveApplicationCommand(app.Id, "Approve"), CancellationToken.None);

            Assert.Equal("Accepted", app.Status);
        }

        [Fact]
        public async Task S37_ApproveApplication_RejectAction_UpdatesToRejected()
        {
            var app = new AdmissionApplication(Guid.NewGuid().ToString(), "APP-802", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ApproveApplicationCommandHandler(_appRepo);
            await handler.Handle(new ApproveApplicationCommand(app.Id, "Reject"), CancellationToken.None);

            Assert.Equal("Rejected", app.Status);
        }

        [Fact]
        public async Task S38_ApproveApplication_InvalidApplicationId_ReturnsFailure()
        {
            var handler = new ApproveApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new ApproveApplicationCommand("INVALID", "Verify"), CancellationToken.None);

            Assert.False(result.IsSuccess);
            Assert.Equal("Admissions.NotFound", result.Error.Code);
        }

        [Fact]
        public async Task S39_AdmissionApplication_AddDocument_AssignsUniqueIds()
        {
            var app = new AdmissionApplication("TEST-ID", "APP", "PRG");
            app.AddDocument("Doc1", "Pending");
            app.AddDocument("Doc2", "Pending");

            var doc1 = app.Documents.First(d => d.Name == "Doc1");
            var doc2 = app.Documents.First(d => d.Name == "Doc2");

            Assert.NotEqual(doc1.Id, doc2.Id);
        }

        [Fact]
        public async Task S40_AdmissionApplication_Timeline_CanActivateLockedEvent()
        {
            var app = new AdmissionApplication("TEST-ID", "APP", "PRG");
            var evt = app.TimelineEvents.First(t => t.Title == "Under Review");
            
            Assert.Equal("Locked", evt.Status);
            evt.Activate();
            Assert.Equal("Active", evt.Status);
        }
    }
}
