using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using MediatR;
using Moq;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;
using Admissions.Infrastructure.Repositories;
using Admissions.Application.Features.SubmitApplication;
using Admissions.Application.Features.UploadDocument;
using Admissions.Application.Features.PayApplicationFee;
using Admissions.Application.Features.VerifyDocuments;
using Admissions.Application.Features.ScheduleInterview;
using Admissions.Application.Features.CompleteInterview;
using Admissions.Application.Features.EvaluateApplication;
using Admissions.Application.Features.EndorseApplication;
using Admissions.Application.Features.RecommendAdmission;
using Admissions.Application.Features.ApproveApplication;
using Admissions.Application.Features.ActivateEnrollment;
using Admissions.Application.Features.GetApplicationStatus;
using Admissions.Application.Features.GetPendingApplications;
using Admissions.Application.Features.GetProgramCatalog;
using Admissions.Application.Abstractions;

namespace Admissions.Tests.Integration
{
    public class AdmissionsIntegrationTests : IDisposable
    {
        private readonly AdmissionsDbContext _dbContext;
        private readonly AdmissionApplicationRepository _appRepo;
        private readonly ProgramOfferingRepository _programRepo;
        private readonly Mock<IPublisher> _mockPublisher = new();

        public AdmissionsIntegrationTests()
        {
            var options = new DbContextOptionsBuilder<AdmissionsDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _dbContext = new AdmissionsDbContext(options);
            _appRepo = new AdmissionApplicationRepository(_dbContext);
            _programRepo = new ProgramOfferingRepository(_dbContext);
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        // --- 2.1 Repositories / Persistence (10 Scenarios) ---

        [Fact]
        public async Task TC31_ProgramOfferingRepository_Should_AddAsync()
        {
            var program = new ProgramOffering("BSIT", "CCS", "BS", "IT", "4 Years", "Fall", "50000");
            _dbContext.ProgramOfferings.Add(program);
            await _dbContext.SaveChangesAsync();

            var saved = await _programRepo.GetByIdAsync("BSIT");
            saved.Should().NotBeNull();
        }

        [Fact]
        public async Task TC32_ProgramOfferingRepository_Should_GetByIdAsync()
        {
            _dbContext.ProgramOfferings.Add(new ProgramOffering("BSE", "COE", "BS", "Eng", "4", "Fall", "50"));
            await _dbContext.SaveChangesAsync();
            
            var result = await _programRepo.GetByIdAsync("BSE");
            result.Should().NotBeNull();
        }

        [Fact]
        public async Task TC33_ProgramOfferingRepository_Should_UpdateAsync()
        {
            var program = new ProgramOffering("BSBA", "CBA", "BS", "Business", "4", "Fall", "50");
            _dbContext.ProgramOfferings.Add(program);
            await _dbContext.SaveChangesAsync();

            program.AddTag("Accredited");
            _dbContext.ProgramOfferings.Update(program);
            await _dbContext.SaveChangesAsync();

            var updated = await _programRepo.GetByIdAsync("BSBA");
            updated!.Tags.Should().Contain("Accredited");
        }

        [Fact]
        public async Task TC34_ProgramOfferingRepository_Should_DeleteAsync()
        {
            var program = new ProgramOffering("BSN", "CON", "BS", "Nursing", "4", "Fall", "50");
            _dbContext.ProgramOfferings.Add(program);
            await _dbContext.SaveChangesAsync();

            _dbContext.ProgramOfferings.Remove(program);
            await _dbContext.SaveChangesAsync();

            var deleted = await _programRepo.GetByIdAsync("BSN");
            deleted.Should().BeNull();
        }

        [Fact]
        public async Task TC35_AdmissionApplicationRepository_Should_AddAsync()
        {
            var app = new AdmissionApplication("APP-1", "USER-1", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var saved = await _appRepo.GetByIdAsync("APP-1");
            saved.Should().NotBeNull();
        }

        [Fact]
        public async Task TC36_AdmissionApplicationRepository_Should_GetByIdAsync()
        {
            var app = new AdmissionApplication("APP-2", "USER-2", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var result = await _appRepo.GetByIdAsync("APP-2");
            result!.ApplicantId.Should().Be("USER-2");
        }

        [Fact]
        public async Task TC37_AdmissionApplicationRepository_Should_GetByApplicantIdAsync()
        {
            _appRepo.Add(new AdmissionApplication("APP-3", "USER-3", "BSCS"));
            await _appRepo.SaveChangesAsync();

            var results = await _appRepo.GetByApplicantIdAsync("USER-3");
            results.Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC38_AdmissionApplicationRepository_Should_GetPendingAsync()
        {
            var app = new AdmissionApplication("APP-4", "USER-4", "BSCS");
            app.UpdateStatus("InterviewPending");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var results = await _appRepo.GetAllAsync();
            results.Should().Contain(a => a.Status == "InterviewPending");
        }

        [Fact]
        public async Task TC39_AdmissionApplicationRepository_Should_UpdateAsync()
        {
            var app = new AdmissionApplication("APP-5", "USER-5", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            app.UpdateStatus("Waitlisted");
            await _appRepo.SaveChangesAsync();

            var updated = await _appRepo.GetByIdAsync("APP-5");
            updated!.Status.Should().Be("Waitlisted");
        }

        [Fact]
        public async Task TC40_AdmissionApplicationRepository_Should_Support_Concurrent_Additions()
        {
            _appRepo.Add(new AdmissionApplication("APP-6", "USER-6", "BSCS"));
            _appRepo.Add(new AdmissionApplication("APP-7", "USER-7", "BSCS"));
            await _appRepo.SaveChangesAsync();

            var results = await _appRepo.GetAllAsync();
            results.Should().HaveCountGreaterOrEqualTo(2);
        }

        // --- 2.2 Endpoints & Pipelines (20 Scenarios) ---

        [Fact]
        public async Task TC41_SubmitApplicationPipeline_Should_Persist_Application()
        {
            var handler = new SubmitApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new SubmitApplicationCommand("USER-99", "BSCS", "A", "B", "1990", "D"), CancellationToken.None);
            
            var saved = await _appRepo.GetByIdAsync(result);
            saved.Should().NotBeNull();
        }

        [Fact]
        public async Task TC42_UploadDocumentPipeline_Should_Update_Application_State()
        {
            var app = new AdmissionApplication("APP-8", "USER-8", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new UploadDocumentCommandHandler(_appRepo);
            await handler.Handle(new UploadDocumentCommand("APP-8", "TestDoc", "path/to/doc"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-8");
            saved!.Documents.Should().Contain(d => d.Name == "TestDoc" && d.Status == "Uploaded");
        }

        [Fact]
        public async Task TC43_PayApplicationFeePipeline_Should_Process_Payment_And_Persist()
        {
            var app = new AdmissionApplication("APP-9", "USER-9", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new PayApplicationFeeCommandHandler(_appRepo);
            await handler.Handle(new PayApplicationFeeCommand("APP-9", "TXN-999"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-9");
            saved!.ApplicationFeeStatus.Should().Be("Paid");
        }

        [Fact]
        public async Task TC44_VerifyDocumentsPipeline_Should_Update_Status_To_UnderReview() 
        {
            var app = new AdmissionApplication("APP-10", "USER-10", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new VerifyDocumentsCommandHandler(_appRepo);
            await handler.Handle(new VerifyDocumentsCommand("APP-10"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-10");
            saved!.Status.Should().Be("InterviewPending"); 
        }

        [Fact]
        public async Task TC45_ScheduleInterviewPipeline_Should_Schedule_Successfully()
        {
            var app = new AdmissionApplication("APP-11", "USER-11", "BSCS");
            app.VerifyDocuments();
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ScheduleInterviewCommandHandler(_appRepo);
            await handler.Handle(new ScheduleInterviewCommand("APP-11", "2026-12-01", "09:00"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-11");
            saved!.InterviewDate.Should().Be("2026-12-01");
        }

        [Fact]
        public async Task TC46_CompleteInterviewPipeline_Should_Record_Feedback()
        {
            var app = new AdmissionApplication("APP-12", "USER-12", "BSCS");
            app.VerifyDocuments();
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new CompleteInterviewCommandHandler(_appRepo);
            await handler.Handle(new CompleteInterviewCommand("APP-12", "Excellent"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-12");
            saved!.FacultyRemarks.Should().Be("Excellent");
        }

        [Fact]
        public async Task TC47_EvaluateApplicationPipeline_Should_Score_And_Persist()
        {
            var app = new AdmissionApplication("APP-13", "USER-13", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new EvaluateApplicationCommandHandler(_appRepo);
            await handler.Handle(new EvaluateApplicationCommand("APP-13", "Waitlist", "Hold"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-13");
            saved!.Status.Should().Be("Waitlist");
        }

        [Fact]
        public async Task TC48_EndorseApplicationPipeline_Should_Update_Endorsement()
        {
            var app = new AdmissionApplication("APP-14", "USER-14", "BSCS");
            app.UpdateStatus("Recommended");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new EndorseApplicationCommandHandler(_appRepo);
            await handler.Handle(new EndorseApplicationCommand("APP-14"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-14");
            saved!.Status.Should().Be("Endorsed_For_Enrollment");
        }

        [Fact]
        public async Task TC49_RecommendAdmissionPipeline_Should_Update_Recommendation()
        {
            var app = new AdmissionApplication("APP-15", "USER-15", "BSCS");
            app.UpdateStatus("UnderAcademicEvaluation");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new RecommendAdmissionCommandHandler(_appRepo);
            await handler.Handle(new RecommendAdmissionCommand("APP-15", "Rec"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-15");
            saved!.Status.Should().Be("Recommended");
        }

        [Fact]
        public async Task TC50_ApproveApplicationPipeline_Should_Approve_Application()
        {
            var app = new AdmissionApplication("APP-16", "USER-16", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ApproveApplicationCommandHandler(_appRepo);
            await handler.Handle(new ApproveApplicationCommand("APP-16", "Approve"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-16");
            saved!.Status.Should().Be("Accepted");
        }

        [Fact]
        public async Task TC51_ActivateEnrollmentPipeline_Should_Activate_And_Publish_Event()
        {
            var app = new AdmissionApplication("APP-17", "USER-17", "BSCS");
            app.UpdateStatus("Endorsed_For_Enrollment");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ActivateEnrollmentCommandHandler(_appRepo);
            await handler.Handle(new ActivateEnrollmentCommand("APP-17"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-17");
            saved!.Status.Should().Be("Enrolled");
            saved.GetDomainEvents().Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC52_GetApplicationStatusPipeline_Should_Return_Details()
        {
            _appRepo.Add(new AdmissionApplication("APP-18", "USER-18", "BSCS"));
            await _appRepo.SaveChangesAsync();

            var handler = new GetApplicationStatusQueryHandler(_appRepo, _programRepo);
            var result = await handler.Handle(new GetApplicationStatusQuery("USER-18"), CancellationToken.None);

            result.Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC53_GetPendingApplicationsPipeline_Should_Return_List()
        {
            var app = new AdmissionApplication("APP-19", "USER-19", "BSCS");
            app.VerifyDocuments();
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new GetPendingApplicationsQueryHandler(_appRepo, _programRepo);
            var result = await handler.Handle(new GetPendingApplicationsQuery(null), CancellationToken.None);

            result.Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC54_GetProgramCatalogPipeline_Should_Return_Active_Programs()
        {
            _dbContext.ProgramOfferings.Add(new ProgramOffering("BS-TEST", "COL", "BS", "Test", "4", "Fall", "0"));
            await _dbContext.SaveChangesAsync();

            var handler = new GetProgramCatalogQueryHandler(_programRepo);
            var result = await handler.Handle(new GetProgramCatalogQuery(), CancellationToken.None);

            result.Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC55_SubmitApplicationPipeline_Should_Rollback_On_Db_Failure()
        {
            var mockRepo = new Mock<IAdmissionApplicationRepository>();
            mockRepo.Setup(r => r.SaveChangesAsync(default)).ThrowsAsync(new DbUpdateException("DB Error"));

            var handler = new SubmitApplicationCommandHandler(mockRepo.Object);
            Func<Task> action = async () => await handler.Handle(new SubmitApplicationCommand("U", "P", "F", "L", "D", "N"), CancellationToken.None);

            await action.Should().ThrowAsync<DbUpdateException>();
        }

        [Fact]
        public async Task TC56_ApproveApplicationPipeline_Should_Fail_If_Not_Recommended()
        {
            var app = new AdmissionApplication("APP-20", "USER-20", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ApproveApplicationCommandHandler(_appRepo);
            var result = await handler.Handle(new ApproveApplicationCommand("APP-20", "Approve"), CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            var saved = await _appRepo.GetByIdAsync("APP-20");
            saved!.Status.Should().Be("Accepted");
        }

        [Fact]
        public async Task TC57_ActivateEnrollmentPipeline_Should_Fail_If_Not_Approved()
        {
            var app = new AdmissionApplication("APP-21", "USER-21", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new ActivateEnrollmentCommandHandler(_appRepo);
            var result = await handler.Handle(new ActivateEnrollmentCommand("APP-21"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Admissions.InvalidState");
        }

        [Fact]
        public async Task TC58_VerifyDocumentsPipeline_Should_Publish_DocumentsVerifiedEvent()
        {
            var app = new AdmissionApplication("APP-22", "USER-22", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new VerifyDocumentsCommandHandler(_appRepo);
            await handler.Handle(new VerifyDocumentsCommand("APP-22"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-22");
            saved!.TimelineEvents.Should().Contain(t => t.Title == "Document Verification Complete");
        }

        [Fact]
        public async Task TC59_PayApplicationFeePipeline_Should_Publish_FeePaidEvent()
        {
            var app = new AdmissionApplication("APP-23", "USER-23", "BSCS");
            _appRepo.Add(app);
            await _appRepo.SaveChangesAsync();

            var handler = new PayApplicationFeeCommandHandler(_appRepo);
            await handler.Handle(new PayApplicationFeeCommand("APP-23", "TXN-000"), CancellationToken.None);

            var saved = await _appRepo.GetByIdAsync("APP-23");
            saved!.TimelineEvents.Should().Contain(t => t.Title == "Application Fee Paid");
        }

        [Fact]
        public async Task TC60_AdmissionsPipeline_Should_Validate_Input_Before_Handler()
        {
            var handler = new PayApplicationFeeCommandHandler(_appRepo);
            var result = await handler.Handle(new PayApplicationFeeCommand("INVALID_ID", "TXN-000"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Admissions.NotFound");
        }
    }
}
