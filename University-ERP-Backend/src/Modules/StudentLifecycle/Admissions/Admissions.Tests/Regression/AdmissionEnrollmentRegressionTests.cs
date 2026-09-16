namespace Admissions.Tests.Regression;

using System;
using System.Linq;
using Admissions.Domain.Aggregates;
using Admissions.Domain.Events;
using FluentAssertions;
using Xunit;

/// <summary>
/// Regression Test Suite: Admissions → Enrollment Lifecycle Invariants
/// 
/// Purpose:
/// Protects the known-good Admissions to Enrollment sequential business workflow.
/// Verifies that no intermediate evaluation steps can be bypassed, double-activation
/// is rejected, and state remains strictly immutable upon failure.
/// </summary>
public class AdmissionEnrollmentRegressionTests
{
    private static AdmissionApplication CreateValidApplication(string id = "APP-2026-REG-01")
    {
        return new AdmissionApplication(id, "CAND-001", "BSCS");
    }

    [Fact]
    public void Valid_Applicant_Can_Still_Complete_Enrollment_Workflow()
    {
        // Arrange
        var application = CreateValidApplication();
        application.Status.Should().Be("Submitted", "an application must always initialize in Submitted status");

        // Act - Step 1: Verify Documents
        var docResult = application.VerifyDocuments();
        docResult.IsSuccess.Should().BeTrue();
        application.Status.Should().Be("InterviewPending");

        // Act - Step 2: Schedule Interview
        var scheduleResult = application.ScheduleInterview("2026-10-15", "09:00 AM");
        scheduleResult.IsSuccess.Should().BeTrue();
        application.Status.Should().Be("InterviewScheduled");
        application.InterviewDate.Should().Be("2026-10-15");
        application.InterviewTime.Should().Be("09:00 AM");

        // Act - Step 3: Complete Interview
        var interviewResult = application.CompleteInterview("Candidate passed with distinction.");
        interviewResult.IsSuccess.Should().BeTrue();
        application.Status.Should().Be("UnderAcademicEvaluation");
        application.FacultyRemarks.Should().Be("Candidate passed with distinction.");

        // Act - Step 4: Chairperson Recommendation
        var recommendResult = application.Recommend("Recommended for BSCS by Department Chair.");
        recommendResult.IsSuccess.Should().BeTrue();
        application.Status.Should().Be("Recommended");

        // Act - Step 5: Dean Endorsement
        var endorseResult = application.Endorse();
        endorseResult.IsSuccess.Should().BeTrue();
        application.Status.Should().Be("Endorsed_For_Enrollment");

        // Act - Step 6: Official Enrollment Activation
        const string expectedStudentId = "STU-2026-0042";
        var activationResult = application.ActivateEnrollment(expectedStudentId);

        // Assert - Final Lifecycle State
        activationResult.IsSuccess.Should().BeTrue();
        application.Status.Should().Be("Enrolled");
        application.OfficialStudentId.Should().Be(expectedStudentId);

        // Assert - Domain Event Invariant
        application.GetDomainEvents().Should().ContainSingle(e => e is StudentEnrolledDomainEvent);
        var enrolledEvent = application.GetDomainEvents().OfType<StudentEnrolledDomainEvent>().Single();
        enrolledEvent.GeneratedStudentId.Should().Be(expectedStudentId);
        enrolledEvent.ApplicationId.Should().Be(application.Id);
    }

    [Fact]
    public void Applicant_Cannot_Bypass_Required_Admission_Steps()
    {
        // Arrange: Application fresh in Submitted state
        var application = CreateValidApplication();

        // Act: Attempt direct activation skipping verification, interview, and endorsements
        var result = application.ActivateEnrollment("STU-2026-0042");

        // Assert: Must be rejected with domain error
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
        application.Status.Should().Be("Submitted", "status must remain Submitted on failed bypass");
        application.OfficialStudentId.Should().BeEmpty();
        application.GetDomainEvents().Should().BeEmpty("no events may be emitted on an illegal transition");
    }

    [Theory]
    [InlineData("InterviewPending")]
    [InlineData("InterviewScheduled")]
    [InlineData("UnderAcademicEvaluation")]
    [InlineData("Recommended")]
    public void Applicant_Cannot_Activate_Enrollment_From_Intermediate_States(string targetState)
    {
        // Arrange: Advance application up to the target intermediate state
        var application = CreateValidApplication();
        application.VerifyDocuments();

        if (targetState == "InterviewScheduled" || targetState == "UnderAcademicEvaluation" || targetState == "Recommended")
        {
            application.ScheduleInterview("2026-10-15", "10:00 AM");
        }

        if (targetState == "UnderAcademicEvaluation" || targetState == "Recommended")
        {
            application.CompleteInterview("Passed");
        }

        if (targetState == "Recommended")
        {
            application.Recommend("Recommended by Chair");
        }

        application.Status.Should().Be(targetState);

        // Act: Attempt to prematurely activate enrollment before Dean Endorsement
        var result = application.ActivateEnrollment("STU-2026-9999");

        // Assert: Activation must fail, and status must remain untouched
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Admissions.InvalidState");
        application.Status.Should().Be(targetState, "state must remain immutable on rejected activation");
        application.OfficialStudentId.Should().BeEmpty();
    }

    [Fact]
    public void Enrolled_Applicant_Cannot_Be_Activated_Twice()
    {
        // Arrange: Complete full lifecycle to Enrolled
        var application = CreateValidApplication();
        application.VerifyDocuments();
        application.ScheduleInterview("2026-10-15", "09:00 AM");
        application.CompleteInterview("Passed");
        application.Recommend("Recommended");
        application.Endorse();
        
        const string initialStudentId = "STU-2026-0042";
        var firstResult = application.ActivateEnrollment(initialStudentId);
        firstResult.IsSuccess.Should().BeTrue();
        application.ClearDomainEvents();

        // Act: Attempt double activation with a new student ID
        var secondResult = application.ActivateEnrollment("STU-2026-9999");

        // Assert: Invariant violation
        secondResult.IsFailure.Should().BeTrue();
        secondResult.Error.Code.Should().Be("Admissions.InvalidState");
        application.Status.Should().Be("Enrolled");
        application.OfficialStudentId.Should().Be(initialStudentId, "student ID must not be overwritten");
        application.GetDomainEvents().Should().BeEmpty("duplicate activation must not publish additional domain events");
    }

    [Fact]
    public void Fee_Payment_Prevents_Duplicate_Transactions()
    {
        // Arrange
        var application = CreateValidApplication();
        application.ApplicationFeeStatus.Should().Be("Pending");

        // Act - First Payment
        var firstPayment = application.MarkFeeAsPaid("TXN-PAY-001");
        firstPayment.IsSuccess.Should().BeTrue();
        application.ApplicationFeeStatus.Should().Be("Paid");
        application.ApplicationFeeTransactionId.Should().Be("TXN-PAY-001");

        // Act - Duplicate Payment
        var duplicatePayment = application.MarkFeeAsPaid("TXN-PAY-002");

        // Assert
        duplicatePayment.IsFailure.Should().BeTrue();
        duplicatePayment.Error.Code.Should().Be("Admissions.FeeAlreadyPaid");
        application.ApplicationFeeTransactionId.Should().Be("TXN-PAY-001", "transaction ID must not be overwritten on duplicate payment");
    }
}
