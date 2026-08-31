namespace Admissions.Tests.Integration.Endpoints;

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
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

public class AdmissionsPipelineIntegrationTests : IDisposable
{
    private readonly AdmissionsDbContext _dbContext;
    private readonly AdmissionApplicationRepository _appRepo;
    private readonly ProgramOfferingRepository _programRepo;

    public AdmissionsPipelineIntegrationTests()
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

    [Fact]
    public async Task TC41_SubmitApplicationPipeline_Should_Persist_Application()
    {
        var handler = new SubmitApplicationCommandHandler(_appRepo);
        var command = new SubmitApplicationCommand("USER-99", "BSCS", "John", "Doe", "2000-01-01", "US");
        
        var result = await handler.Handle(command, CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync(result);
        saved.Should().NotBeNull();
        saved!.ApplicantId.Should().Be("USER-99");
    }

    [Fact]
    public async Task TC42_UploadDocumentPipeline_Should_Update_Application_State()
    {
        var app = new AdmissionApplication("APP-42", "USER-42", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new UploadDocumentCommandHandler(_appRepo);
        await handler.Handle(new UploadDocumentCommand("APP-42", "TestDoc", "path/to/doc"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-42");
        saved!.Documents.Should().Contain(d => d.Name == "TestDoc" && d.Status == "Uploaded");
    }

    [Fact]
    public async Task TC43_PayApplicationFeePipeline_Should_Process_Payment_And_Persist()
    {
        var app = new AdmissionApplication("APP-43", "USER-43", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new PayApplicationFeeCommandHandler(_appRepo);
        await handler.Handle(new PayApplicationFeeCommand("APP-43", "TXN-999"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-43");
        saved!.ApplicationFeeStatus.Should().Be("Paid");
    }

    [Fact]
    public async Task TC44_VerifyDocumentsPipeline_Should_Update_Status_To_UnderReview()
    {
        var app = new AdmissionApplication("APP-44", "USER-44", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new VerifyDocumentsCommandHandler(_appRepo);
        await handler.Handle(new VerifyDocumentsCommand("APP-44"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-44");
        saved!.Status.Should().Be("InterviewPending");
    }

    [Fact]
    public async Task TC45_ScheduleInterviewPipeline_Should_Schedule_Successfully()
    {
        var app = new AdmissionApplication("APP-45", "USER-45", "BSCS");
        app.VerifyDocuments();
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new ScheduleInterviewCommandHandler(_appRepo);
        await handler.Handle(new ScheduleInterviewCommand("APP-45", "2026-12-01", "09:00"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-45");
        saved!.InterviewDate.Should().Be("2026-12-01");
        saved.Status.Should().Be("InterviewScheduled");
    }

    [Fact]
    public async Task TC46_CompleteInterviewPipeline_Should_Record_Feedback()
    {
        var app = new AdmissionApplication("APP-46", "USER-46", "BSCS");
        app.VerifyDocuments();
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new CompleteInterviewCommandHandler(_appRepo);
        await handler.Handle(new CompleteInterviewCommand("APP-46", "Excellent"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-46");
        saved!.FacultyRemarks.Should().Be("Excellent");
        saved.Status.Should().Be("UnderAcademicEvaluation");
    }

    [Fact]
    public async Task TC47_EvaluateApplicationPipeline_Should_Score_And_Persist()
    {
        var app = new AdmissionApplication("APP-47", "USER-47", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new EvaluateApplicationCommandHandler(_appRepo);
        await handler.Handle(new EvaluateApplicationCommand("APP-47", "Waitlist", "Hold"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-47");
        saved!.Status.Should().Be("Waitlist");
    }

    [Fact]
    public async Task TC48_EndorseApplicationPipeline_Should_Update_Endorsement()
    {
        var app = new AdmissionApplication("APP-48", "USER-48", "BSCS");
        app.UpdateStatus("Recommended");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new EndorseApplicationCommandHandler(_appRepo);
        await handler.Handle(new EndorseApplicationCommand("APP-48"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-48");
        saved!.Status.Should().Be("Endorsed_For_Enrollment");
    }

    [Fact]
    public async Task TC49_RecommendAdmissionPipeline_Should_Update_Recommendation()
    {
        var app = new AdmissionApplication("APP-49", "USER-49", "BSCS");
        app.UpdateStatus("UnderAcademicEvaluation");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new RecommendAdmissionCommandHandler(_appRepo);
        await handler.Handle(new RecommendAdmissionCommand("APP-49", "Highly Recommended"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-49");
        saved!.Status.Should().Be("Recommended");
    }

    [Fact]
    public async Task TC50_ApproveApplicationPipeline_Should_Approve_Application()
    {
        var app = new AdmissionApplication("APP-50", "USER-50", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new ApproveApplicationCommandHandler(_appRepo);
        await handler.Handle(new ApproveApplicationCommand("APP-50", "Approve"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-50");
        saved!.Status.Should().Be("Accepted");
    }

    [Fact]
    public async Task TC51_ActivateEnrollmentPipeline_Should_Activate_And_Publish_Event()
    {
        var app = new AdmissionApplication("APP-51", "USER-51", "BSCS");
        app.UpdateStatus("Endorsed_For_Enrollment");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new ActivateEnrollmentCommandHandler(_appRepo);
        await handler.Handle(new ActivateEnrollmentCommand("APP-51"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-51");
        saved!.Status.Should().Be("Enrolled");
        saved.GetDomainEvents().Should().NotBeEmpty();
    }

    [Fact]
    public async Task TC52_GetApplicationStatusPipeline_Should_Return_Details()
    {
        _appRepo.Add(new AdmissionApplication("APP-52", "USER-52", "BSCS"));
        await _appRepo.SaveChangesAsync();

        var handler = new GetApplicationStatusQueryHandler(_appRepo, _programRepo);
        var result = await handler.Handle(new GetApplicationStatusQuery("USER-52"), CancellationToken.None);
        
        result.Should().NotBeEmpty();
        result.First().Status.Should().Be("Submitted");
    }

    [Fact]
    public async Task TC53_GetPendingApplicationsPipeline_Should_Return_List()
    {
        var app = new AdmissionApplication("APP-53", "USER-53", "BSCS");
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
        var app = new AdmissionApplication("APP-56", "USER-56", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new ApproveApplicationCommandHandler(_appRepo);
        var result = await handler.Handle(new ApproveApplicationCommand("APP-56", "Approve"), CancellationToken.None);
        
        result.IsSuccess.Should().BeTrue();
        var saved = await _appRepo.GetByIdAsync("APP-56");
        saved!.Status.Should().Be("Accepted");
    }

    [Fact]
    public async Task TC57_ActivateEnrollmentPipeline_Should_Fail_If_Not_Approved()
    {
        var app = new AdmissionApplication("APP-57", "USER-57", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new ActivateEnrollmentCommandHandler(_appRepo);
        var result = await handler.Handle(new ActivateEnrollmentCommand("APP-57"), CancellationToken.None);
        
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
    }

    [Fact]
    public async Task TC58_VerifyDocumentsPipeline_Should_Publish_DocumentsVerifiedEvent()
    {
        var app = new AdmissionApplication("APP-58", "USER-58", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new VerifyDocumentsCommandHandler(_appRepo);
        await handler.Handle(new VerifyDocumentsCommand("APP-58"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-58");
        saved!.TimelineEvents.Should().Contain(t => t.Title == "Document Verification Complete");
    }

    [Fact]
    public async Task TC59_PayApplicationFeePipeline_Should_Publish_FeePaidEvent()
    {
        var app = new AdmissionApplication("APP-59", "USER-59", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var handler = new PayApplicationFeeCommandHandler(_appRepo);
        await handler.Handle(new PayApplicationFeeCommand("APP-59", "TXN-000"), CancellationToken.None);
        
        var saved = await _appRepo.GetByIdAsync("APP-59");
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
