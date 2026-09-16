namespace UniversityErp.Tests.EndToEnd;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using MediatR;

using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;
using Admissions.Infrastructure.Repositories;
using Admissions.Application.Features.SubmitApplication;
using Admissions.Application.Features.UploadDocument;
using Admissions.Application.Features.VerifyDocuments;
using Admissions.Application.Features.ScheduleInterview;
using Admissions.Application.Features.CompleteInterview;
using Admissions.Application.Features.EvaluateApplication;
using Admissions.Application.Features.RecommendAdmission;
using Admissions.Application.Features.EndorseApplication;
using Admissions.Application.Features.ActivateEnrollment;

using Finance.Domain.Aggregates;
using Finance.Infrastructure.Persistence;
using Finance.Infrastructure.Repositories;
using Finance.Application.Abstractions;
using Finance.Presentation.Endpoints;

using StudentInformation.Domain.Aggregates;
using StudentInformation.Infrastructure.Persistence;
using StudentInformation.Infrastructure.Repositories;
using StudentInformation.Application.Abstractions;
using StudentInformation.Application.Features.GetStudentInformation;

using Contracts.IntegrationEvents.StudentLifecycle;
using Contracts.IntegrationEvents.Administration;

public class AdmissionToEnrollmentFlow
{
    [Fact]
    public async Task CompleteAdmissionToEnrollmentAndFinancialsLifecycle_SucceedsEndToEnd()
    {
        // ─── 1. Setup Isolated In-Memory Persistence & Repositories ───────────
        var dbId = Guid.NewGuid().ToString();

        var admissionsOptions = new DbContextOptionsBuilder<AdmissionsDbContext>()
            .UseInMemoryDatabase($"Admissions_{dbId}")
            .Options;
        var admissionsDb = new AdmissionsDbContext(admissionsOptions);
        var appRepo = new AdmissionApplicationRepository(admissionsDb);

        var financeOptions = new DbContextOptionsBuilder<FinanceDbContext>()
            .UseInMemoryDatabase($"Finance_{dbId}")
            .Options;
        var financeDb = new FinanceDbContext(financeOptions);
        var billingRepo = new StudentBillingRepository(financeDb);
        var paymentRepo = new PaymentSessionRepository(financeDb);
        var cashRepo = new CashTransactionRepository(financeDb);

        var studentInfoOptions = new DbContextOptionsBuilder<StudentInformationDbContext>()
            .UseInMemoryDatabase($"StudentInfo_{dbId}")
            .Options;
        var studentInfoDb = new StudentInformationDbContext(studentInfoOptions);
        var studentRecordRepo = new StudentAcademicRecordRepository(studentInfoDb);

        // ─── 2. Setup Real-time In-Process Event Dispatcher ───────────────────
        var publishedEvents = new List<object>();

        var testPublisher = new TestPublisher(publishedEvents, async (evt, ct) =>
        {
            if (evt is ApplicantAcceptedIntegrationEvent acceptedEvent)
            {
                var consumer = new Finance.Application.Consumers.ApplicantAcceptedIntegrationEventConsumer(
                    billingRepo, 
                    NullLogger<Finance.Application.Consumers.ApplicantAcceptedIntegrationEventConsumer>.Instance);
                await consumer.Handle(acceptedEvent, ct);
            }
            else if (evt is StudentEnrolledIntegrationEvent enrolledEvent)
            {
                var studentInfoConsumer = new StudentInformation.Application.Consumers.StudentEnrolledIntegrationEventConsumer(
                    studentRecordRepo, 
                    NullLogger<StudentInformation.Application.Consumers.StudentEnrolledIntegrationEventConsumer>.Instance);
                await studentInfoConsumer.Handle(enrolledEvent, ct);

                var senderMock = new TestSender();
                var financeConsumer = new Finance.Application.Consumers.StudentEnrolledIntegrationEventConsumer(
                    senderMock, 
                    NullLogger<Finance.Application.Consumers.StudentEnrolledIntegrationEventConsumer>.Instance);
                await financeConsumer.Handle(enrolledEvent, ct);
            }
        });

        // ─── STEP 1: Applicant Submits Application ─────────────────────────────
        var submitHandler = new SubmitApplicationCommandHandler(appRepo);
        var appId = await submitHandler.Handle(
            new SubmitApplicationCommand("APP-2026-0099", "BSCS", "Arthur", "Dent", "2000-01-01", "Domestic"),
            CancellationToken.None);

        appId.Should().NotBeNull();
        var application = await appRepo.GetByIdAsync(appId);
        application.Should().NotBeNull();
        application!.Status.Should().Be("Submitted");

        // ─── STEP 2: Document Upload & Verification ───────────────────────────
        var uploadHandler = new UploadDocumentCommandHandler(appRepo);
        await uploadHandler.Handle(new UploadDocumentCommand(appId, "HighSchoolReportCard", "/storage/docs/card.pdf"), CancellationToken.None);

        var verifyHandler = new VerifyDocumentsCommandHandler(appRepo);
        var verifyResult = await verifyHandler.Handle(new VerifyDocumentsCommand(appId), CancellationToken.None);
        verifyResult.IsSuccess.Should().BeTrue();

        // ─── STEP 3: Interview & Committee Evaluation ─────────────────────────
        var interviewScheduleHandler = new ScheduleInterviewCommandHandler(appRepo);
        await interviewScheduleHandler.Handle(new ScheduleInterviewCommand(appId, "2026-10-01", "10:00 AM"), CancellationToken.None);

        var interviewCompleteHandler = new CompleteInterviewCommandHandler(appRepo);
        await interviewCompleteHandler.Handle(new CompleteInterviewCommand(appId, "Applicant demonstrates strong analytical aptitude."), CancellationToken.None);

        var evalHandler = new EvaluateApplicationCommandHandler(appRepo);
        var evalResult = await evalHandler.Handle(new EvaluateApplicationCommand(appId, "Accept", "Strong candidate for Computer Science."), CancellationToken.None);
        evalResult.IsSuccess.Should().BeTrue();

        var recommendHandler = new RecommendAdmissionCommandHandler(appRepo);
        var recommendResult = await recommendHandler.Handle(new RecommendAdmissionCommand(appId, "Recommended without reservation."), CancellationToken.None);
        recommendResult.IsSuccess.Should().BeTrue();

        // ─── STEP 4: Dean Endorsement & Cross-Module Event to Finance ─────────
        var endorseHandler = new EndorseApplicationCommandHandler(appRepo, testPublisher);
        var endorseResult = await endorseHandler.Handle(new EndorseApplicationCommand(appId), CancellationToken.None);
        endorseResult.IsSuccess.Should().BeTrue();

        var endorsedApp = await appRepo.GetByIdAsync(appId);
        endorsedApp!.Status.Should().Be("Endorsed_For_Enrollment");

        // Assert ApplicantAcceptedIntegrationEvent was published and consumed by Finance
        publishedEvents.Should().ContainSingle(e => e is ApplicantAcceptedIntegrationEvent);
        var pendingBillings = await billingRepo.GetAllAsync();
        pendingBillings.Should().NotBeEmpty();
        var candidateBilling = pendingBillings.First();
        candidateBilling.TotalAmount.Should().Be(3500.00m);
        candidateBilling.Description.Should().Contain("BSCS");

        // ─── STEP 5: Finance Endpoint Assessment Queue & Downpayment Verification ─
        var financeEndpoint = new EnrollmentFinanceEndpoint(paymentRepo, cashRepo, billingRepo, testPublisher);
        var pendingAssessmentsResult = await financeEndpoint.GetPendingAssessments(CancellationToken.None);
        var okResult = pendingAssessmentsResult as Microsoft.AspNetCore.Mvc.OkObjectResult;
        okResult.Should().NotBeNull();
        var assessmentList = okResult!.Value as System.Collections.IEnumerable;
        assessmentList.Should().NotBeNull();

        // Create & Reconcile Downpayment Session in Finance
        var sessionResult = PaymentSession.Create(
            $"INV-{candidateBilling.Id.ToString()[..8]}",
            appId,
            875.00m, // 25% downpayment
            "Admissions Downpayment"
        );
        sessionResult.IsSuccess.Should().BeTrue();
        var session = sessionResult.Value;
        await paymentRepo.AddAsync(session);
        await paymentRepo.SaveChangesAsync();

        var verifyDownpaymentResult = await financeEndpoint.VerifyDownpayment(session.SessionId, CancellationToken.None);
        verifyDownpaymentResult.Should().BeOfType<Microsoft.AspNetCore.Mvc.OkObjectResult>();

        // Assert PaymentVerifiedIntegrationEvent was published
        publishedEvents.Should().ContainSingle(e => e is PaymentVerifiedIntegrationEvent);

        // ─── STEP 6: Registrar Activates Official Enrollment ───────────────────
        var activateHandler = new ActivateEnrollmentCommandHandler(appRepo);
        var activateResult = await activateHandler.Handle(new ActivateEnrollmentCommand(appId), CancellationToken.None);
        activateResult.IsSuccess.Should().BeTrue();
        var generatedStudentId = activateResult.Value;
        generatedStudentId.Should().StartWith("STU-");

        var enrolledApp = await appRepo.GetByIdAsync(appId);
        enrolledApp!.Status.Should().Be("Enrolled");
        enrolledApp.OfficialStudentId.Should().Be(generatedStudentId);

        // Dispatch StudentEnrolledIntegrationEvent from Admissions
        var enrollmentEvent = new StudentEnrolledIntegrationEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            appId,
            generatedStudentId
        );
        await testPublisher.Publish(enrollmentEvent, CancellationToken.None);

        // ─── STEP 7: StudentInformation Auto-Provisions Academic Record ─────────
        var studentRecord = await studentRecordRepo.GetByStudentIdAsync(generatedStudentId);
        studentRecord.Should().NotBeNull();
        studentRecord!.StudentId.Should().Be(generatedStudentId);
        studentRecord.AcademicStanding.Should().Be("GOOD");
        studentRecord.CumulativeGpa.Should().Be(0.00m);

        // ─── STEP 8: Verification of Statements & Student Information Queries ──
        var statementsEndpoint = new StatementsEndpoint(billingRepo);
        var statementResult = await statementsEndpoint.GetStatementDetail(candidateBilling.StudentId.ToString(), CancellationToken.None);
        var statementOk = statementResult as Microsoft.AspNetCore.Mvc.OkObjectResult;
        statementOk.Should().NotBeNull();
        var statementDto = statementOk!.Value as StatementOfAccountDetailDto;
        statementDto.Should().NotBeNull();
        statementDto!.Student.Should().NotBeNull();

        var studentProfileHandler = new GetStudentProfileQueryHandler();
        var profile = await studentProfileHandler.Handle(new GetStudentProfileQuery(generatedStudentId), CancellationToken.None);
        profile.Should().NotBeNull();
        profile.Id.Should().Be(generatedStudentId);
    }

    [Fact]
    public async Task Regression_BypassingSteps_FailsInEndToEndWorkflow()
    {
        // Setup isolated in-memory DB
        var dbId = Guid.NewGuid().ToString();
        var admissionsOptions = new DbContextOptionsBuilder<AdmissionsDbContext>()
            .UseInMemoryDatabase($"Admissions_Reg_{dbId}")
            .Options;
        var admissionsDb = new AdmissionsDbContext(admissionsOptions);
        var appRepo = new AdmissionApplicationRepository(admissionsDb);

        var publishedEvents = new List<object>();
        var testPublisher = new TestPublisher(publishedEvents, (evt, ct) => Task.CompletedTask);

        // 1. Submit application
        var submitHandler = new SubmitApplicationCommandHandler(appRepo);
        var appId = await submitHandler.Handle(new SubmitApplicationCommand(
            "APP-REG-BYPASS-01", "BSCS", "Alice", "Tester", "2000-01-01", "Filipino"), CancellationToken.None);

        // 2. Attempt direct ActivateEnrollmentCommand without DocumentVerification or Dean Endorsement
        var activateHandler = new ActivateEnrollmentCommandHandler(appRepo, testPublisher);
        var result = await activateHandler.Handle(new ActivateEnrollmentCommand(appId), CancellationToken.None);

        // Invariant: Must fail with Admissions.InvalidState
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");

        // Verify state remains Submitted and zero downstream events were emitted
        var app = await appRepo.GetByIdAsync(appId);
        app!.Status.Should().Be("Submitted");
        app.OfficialStudentId.Should().BeEmpty();
        publishedEvents.Should().BeEmpty("no integration or domain events may be published on failed workflow bypass");
    }
}

// ─── Test Helper Publisher & Sender ──────────────────────────────────────────
internal sealed class TestPublisher : IPublisher
{
    private readonly List<object> _events;
    private readonly Func<object, CancellationToken, Task> _handler;

    public TestPublisher(List<object> events, Func<object, CancellationToken, Task> handler)
    {
        _events = events;
        _handler = handler;
    }

    public async Task Publish(object notification, CancellationToken cancellationToken = default)
    {
        _events.Add(notification);
        await _handler(notification, cancellationToken);
    }

    public async Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default) where TNotification : INotification
    {
        _events.Add(notification);
        await _handler(notification, cancellationToken);
    }
}

internal sealed class TestSender : ISender
{
    public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(default(TResponse)!);
    }

    public Task Send<TRequest>(TRequest request, CancellationToken cancellationToken = default) where TRequest : IRequest
    {
        return Task.CompletedTask;
    }

    public Task<object?> Send(object request, CancellationToken cancellationToken = default)
    {
        return Task.FromResult<object?>(null);
    }

    public IAsyncEnumerable<TResponse> CreateStream<TResponse>(IStreamRequest<TResponse> request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}

