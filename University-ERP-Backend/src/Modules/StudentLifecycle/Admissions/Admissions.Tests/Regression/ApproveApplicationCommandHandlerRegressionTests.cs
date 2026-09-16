namespace Admissions.Tests.Regression;

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using MediatR;
using Moq;
using Xunit;
using Admissions.Application.Abstractions;
using Admissions.Application.Features.ApproveApplication;
using Admissions.Domain.Aggregates;
using Admissions.Domain.Events;
using SharedKernel.Domain.Primitives;
using Contracts.IntegrationEvents.StudentLifecycle;

/// <summary>
/// Regression Test Suite: ApproveApplicationCommandHandler Action Dispatch & Invariant Protection
///
/// What previously working behavior are we protecting?
/// - Protecting all valid faculty/committee workflow transitions ("Verify", "Approve", "Reject")
/// - Protecting the newly supported admissions orchestration actions ("Recommend", "Endorse", "Activate")
///   which are dispatched by the frontend API clients and AdmissionsWorkflow SDK
/// - Protecting aggregate invariants against illegal action bypass, invalid states, and unrecognized action fall-through
///
/// What specific breakage would cause these tests to fail?
/// - Fall-through handlers silently returning Success(true) for unhandled actions without mutating database state
/// - Permitting "Recommend" when interview was not completed
/// - Permitting "Endorse" when application was not recommended
/// - Permitting "Activate" when application was not endorsed
/// - Overwriting existing official student ID on duplicate activation
/// - Failing to publish required integration events (ApplicantAcceptedIntegrationEvent, StudentEnrolledDomainEvent)
/// </summary>
public class ApproveApplicationCommandHandlerRegressionTests
{
    private readonly Mock<IAdmissionApplicationRepository> _mockRepo = new();
    private readonly Mock<IPublisher> _mockPublisher = new();

    private static AdmissionApplication CreateApplicationInState(string state, string id = "APP-REG-01")
    {
        var app = new AdmissionApplication(id, "CAND-001", "BSCS");
        if (state == "Submitted") return app;

        app.VerifyDocuments(); // -> InterviewPending
        if (state == "InterviewPending") return app;

        app.ScheduleInterview("2026-10-15", "10:00 AM"); // -> InterviewScheduled
        if (state == "InterviewScheduled") return app;

        app.CompleteInterview("Passed interview"); // -> UnderAcademicEvaluation
        if (state == "UnderAcademicEvaluation") return app;

        app.Recommend("Recommended by Chair"); // -> Recommended
        if (state == "Recommended") return app;

        app.Endorse(); // -> Endorsed_For_Enrollment
        if (state == "Endorsed_For_Enrollment") return app;

        app.ActivateEnrollment("STU-2026-1001"); // -> Enrolled
        return app;
    }

    [Fact]
    public async Task Handle_WhenActionIsVerify_TransitionsToInterviewPending_AndSavesChanges()
    {
        // Arrange
        var app = CreateApplicationInState("Submitted");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Verify"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        app.Status.Should().Be("InterviewPending");
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenActionIsRecommend_FromUnderAcademicEvaluation_TransitionsToRecommended_AndSavesRemarks()
    {
        // Arrange
        var app = CreateApplicationInState("UnderAcademicEvaluation");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        const string remarks = "Candidate demonstrated exceptional proficiency in algorithms.";
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Recommend", remarks), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        app.Status.Should().Be("Recommended");
        app.FacultyRemarks.Should().Be(remarks);
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenActionIsRecommend_FromSubmitted_FailsWithInvalidState_AndDoesNotMutateState()
    {
        // Arrange: Cannot jump directly from Submitted to Recommended
        var app = CreateApplicationInState("Submitted");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Recommend", "Premature"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
        app.Status.Should().Be("Submitted", "status must remain Submitted on rejected recommendation");
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenActionIsEndorse_FromRecommended_TransitionsToEndorsed_AndPublishesApplicantAcceptedEvent()
    {
        // Arrange
        var app = CreateApplicationInState("Recommended");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Endorse"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        app.Status.Should().Be("Endorsed_For_Enrollment");
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockPublisher.Verify(p => p.Publish(It.IsAny<ApplicantAcceptedIntegrationEvent>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenActionIsEndorse_FromUnderAcademicEvaluation_FailsWithInvalidState()
    {
        // Arrange: Dean cannot endorse unrecommended applicant
        var app = CreateApplicationInState("UnderAcademicEvaluation");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Endorse"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
        app.Status.Should().Be("UnderAcademicEvaluation");
        _mockPublisher.Verify(p => p.Publish(It.IsAny<ApplicantAcceptedIntegrationEvent>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenActionIsActivate_FromEndorsed_TransitionsToEnrolled_AndPublishesStudentEnrolledDomainEvent()
    {
        // Arrange
        var app = CreateApplicationInState("Endorsed_For_Enrollment");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Activate"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        app.Status.Should().Be("Enrolled");
        app.OfficialStudentId.Should().StartWith("STU-");
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockPublisher.Verify(p => p.Publish(It.Is<IDomainEvent>(e => e is StudentEnrolledDomainEvent), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenActionIsActivate_FromRecommended_FailsWithInvalidState()
    {
        // Arrange: Registrar cannot activate without Dean endorsement
        var app = CreateApplicationInState("Recommended");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Activate"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
        app.Status.Should().Be("Recommended");
        app.OfficialStudentId.Should().BeEmpty();
        _mockPublisher.Verify(p => p.Publish(It.IsAny<IDomainEvent>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenActionIsActivate_OnAlreadyEnrolled_FailsWithInvalidState()
    {
        // Arrange
        var app = CreateApplicationInState("Enrolled");
        var existingStudentId = app.OfficialStudentId;
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act: Attempt double activation
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "Activate"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
        app.Status.Should().Be("Enrolled");
        app.OfficialStudentId.Should().Be(existingStudentId, "existing student ID must not be mutated");
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenActionIsUnrecognized_FailsWithInvalidAction_AndDoesNotMutateState()
    {
        // Arrange: Bogus or unrecognized action string
        var app = CreateApplicationInState("Submitted");
        _mockRepo.Setup(r => r.GetByIdAsync(app.Id, It.IsAny<CancellationToken>())).ReturnsAsync(app);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand(app.Id, "BypassAllStages"), CancellationToken.None);

        // Assert: MUST FAIL, must not silently return Success(true)
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidAction");
        app.Status.Should().Be("Submitted");
        _mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenApplicationNotFound_ReturnsAdmissionsNotFound()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync("NON-EXISTENT", It.IsAny<CancellationToken>()))
            .ReturnsAsync((AdmissionApplication)null!);
        var handler = new ApproveApplicationCommandHandler(_mockRepo.Object, _mockPublisher.Object);

        // Act
        var result = await handler.Handle(new ApproveApplicationCommand("NON-EXISTENT", "Verify"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.NotFound");
    }
}
