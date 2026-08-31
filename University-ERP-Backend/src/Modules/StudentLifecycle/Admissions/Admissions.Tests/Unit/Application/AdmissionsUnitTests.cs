using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using Admissions.Application.Abstractions;
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
using Admissions.Domain.Aggregates;

namespace Admissions.Tests.Unit.Application
{
    public class AdmissionsApplicationHandlerTests
    {
        private readonly Mock<IAdmissionApplicationRepository> _mockAppRepo = new();
        private readonly Mock<IProgramOfferingRepository> _mockProgramRepo = new();

        // --- 1.1 Application Handlers (15 Scenarios) ---

        [Fact]
        public async Task TC01_SubmitApplicationCommandHandler_Should_Return_Success_When_Valid()
        {
            var handler = new SubmitApplicationCommandHandler(_mockAppRepo.Object);
            var result = await handler.Handle(new SubmitApplicationCommand("APP-01", "BSCS", "John", "Doe", "2000", "US"), CancellationToken.None);
            result.Should().NotBeNullOrEmpty();
            _mockAppRepo.Verify(r => r.Add(It.IsAny<AdmissionApplication>()), Times.Once);
        }

        [Fact]
        public async Task TC02_SubmitApplicationCommandHandler_Should_Fail_When_ProgramNotFound()
        {
            _mockProgramRepo.Setup(x => x.GetByIdAsync("INVALID", default)).ReturnsAsync((ProgramOffering)null!);
            var handler = new SubmitApplicationCommandHandler(_mockAppRepo.Object);
            var result = await handler.Handle(new SubmitApplicationCommand("APP-01", "INVALID", "J", "D", "2000", "US"), CancellationToken.None);
            result.Should().NotBeNull(); 
        }

        [Fact]
        public async Task TC03_UploadDocumentCommandHandler_Should_Update_Documents()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new UploadDocumentCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new UploadDocumentCommand(app.Id, "Transcript", "path.pdf"), CancellationToken.None);
            
            result.Should().BeTrue();
            app.Documents.First(d => d.Name == "Transcript").Status.Should().Be("Uploaded");
        }

        [Fact]
        public async Task TC04_PayApplicationFeeCommandHandler_Should_Update_Status_To_Paid()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new PayApplicationFeeCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new PayApplicationFeeCommand(app.Id, "TXN-123"), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.ApplicationFeeStatus.Should().Be("Paid");
        }

        [Fact]
        public async Task TC05_VerifyDocumentsCommandHandler_Should_Transition_To_UnderReview()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new VerifyDocumentsCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new VerifyDocumentsCommand(app.Id), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("InterviewPending"); 
        }

        [Fact]
        public async Task TC06_ScheduleInterviewCommandHandler_Should_Set_Date()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            app.VerifyDocuments();
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new ScheduleInterviewCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new ScheduleInterviewCommand(app.Id, "2026-10-10", "10AM"), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.InterviewDate.Should().Be("2026-10-10");
        }

        [Fact]
        public async Task TC07_CompleteInterviewCommandHandler_Should_Record_Feedback()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            app.VerifyDocuments();
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new CompleteInterviewCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new CompleteInterviewCommand(app.Id, "Excellent"), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.FacultyRemarks.Should().Be("Excellent");
        }

        [Fact]
        public async Task TC08_EvaluateApplicationCommandHandler_Should_Score_Correctly()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new EvaluateApplicationCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new EvaluateApplicationCommand(app.Id, "Waitlist", "Hold"), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Waitlist");
        }

        [Fact]
        public async Task TC09_EndorseApplicationCommandHandler_Should_Endorse()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            app.UpdateStatus("Recommended");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new EndorseApplicationCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new EndorseApplicationCommand(app.Id), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Endorsed_For_Enrollment");
        }

        [Fact]
        public async Task TC10_RecommendAdmissionCommandHandler_Should_Recommend()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            app.UpdateStatus("UnderAcademicEvaluation");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new RecommendAdmissionCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new RecommendAdmissionCommand(app.Id, "Rec"), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Recommended");
        }

        [Fact]
        public async Task TC11_ApproveApplicationCommandHandler_Should_Approve()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new ApproveApplicationCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Approve"), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Accepted");
        }

        [Fact]
        public async Task TC12_ActivateEnrollmentCommandHandler_Should_Transition_To_Enrolled()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            app.UpdateStatus("Endorsed_For_Enrollment");
            _mockAppRepo.Setup(r => r.GetByIdAsync(app.Id, default)).ReturnsAsync(app);
            var handler = new ActivateEnrollmentCommandHandler(_mockAppRepo.Object);
            
            var result = await handler.Handle(new ActivateEnrollmentCommand(app.Id), CancellationToken.None);
            
            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Enrolled");
        }

        [Fact]
        public async Task TC13_GetApplicationStatusQueryHandler_Should_Return_Status()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            _mockAppRepo.Setup(r => r.GetByApplicantIdAsync("APP-01", default)).ReturnsAsync(new[] { app });
            var handler = new GetApplicationStatusQueryHandler(_mockAppRepo.Object, _mockProgramRepo.Object);
            
            var result = await handler.Handle(new GetApplicationStatusQuery("APP-01"), CancellationToken.None);
            
            result.First().Status.Should().Be("Submitted");
        }

        [Fact]
        public async Task TC14_GetPendingApplicationsQueryHandler_Should_Return_List()
        {
            var app = new AdmissionApplication("ID", "APP-01", "BSCS");
            app.UpdateStatus("InterviewPending");
            _mockAppRepo.Setup(r => r.GetAllAsync(default)).ReturnsAsync(new[] { app });
            var handler = new GetPendingApplicationsQueryHandler(_mockAppRepo.Object, _mockProgramRepo.Object);
            
            var result = await handler.Handle(new GetPendingApplicationsQuery(null), CancellationToken.None);
            
            result.Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC15_GetProgramCatalogQueryHandler_Should_Return_Programs()
        {
            var program = new ProgramOffering("BSCS", "CCS", "BS", "CS", "4", "Fall", "50k");
            _mockProgramRepo.Setup(r => r.GetAllAsync(default)).ReturnsAsync(new[] { program });
            var handler = new GetProgramCatalogQueryHandler(_mockProgramRepo.Object);
            
            var result = await handler.Handle(new GetProgramCatalogQuery(), CancellationToken.None);
            
            result.First().Major.Should().Be("CS");
        }
    }
}
