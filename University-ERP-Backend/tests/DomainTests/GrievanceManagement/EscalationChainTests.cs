namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using System;
using GrievanceManagement.Domain.Aggregates;

public class EscalationChainTests
{
    [Fact]
    public void SubmitComplaint_WithEmptyDescription_FailsInvariant()
    {
        var result = Complaint.Submit("STU-101", "Academic", "   ");
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Grievance.EmptyDescription");
    }

    [Fact]
    public void SubmitComplaint_WithEmptyCategory_FailsInvariant()
    {
        var result = Complaint.Submit("STU-101", "", "Grading irregularity in finals");
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Grievance.InvalidCategory");
    }

    [Fact]
    public void ComplaintLifecycle_FollowsCompleteProgression()
    {
        var complaint = Complaint.Submit("STU-102", "Facilities", "Broken lab window").Value;
        complaint.Status.Should().Be("PendingReview");
        complaint.Priority.Should().Be("Normal");

        var investResult = complaint.BeginInvestigation();
        investResult.IsSuccess.Should().BeTrue();
        complaint.Status.Should().Be("UnderInvestigation");

        var escalateResult = complaint.Escalate("Facilities", "High", "Window broken during storm");
        escalateResult.IsSuccess.Should().BeTrue();
        complaint.Status.Should().Be("Escalated");
        complaint.Priority.Should().Be("High");
        complaint.AssignedDepartment.Should().Be("Facilities");

        var resolveResult = complaint.Resolve("Window pane replaced by university contractor.");
        resolveResult.IsSuccess.Should().BeTrue();
        complaint.Status.Should().Be("Resolved");
        complaint.ResolvedOnUtc.Should().NotBeNull();
    }

    [Fact]
    public void Escalate_WhenAlreadyResolved_FailsInvariant()
    {
        var complaint = Complaint.Submit("STU-103", "Administration", "Lost ID card query").Value;
        complaint.Resolve("New card issued.");

        var escalateResult = complaint.Escalate("Security", "Urgent", "Reopen inquiry");
        escalateResult.IsFailure.Should().BeTrue();
        escalateResult.Error.Code.Should().Be("Grievance.AlreadyResolved");
    }

    [Fact]
    public void Resolve_WithoutResolutionNotes_FailsInvariant()
    {
        var complaint = Complaint.Submit("STU-104", "Dining", "Late food service").Value;

        var resolveResult = complaint.Resolve("   ");
        resolveResult.IsFailure.Should().BeTrue();
        resolveResult.Error.Code.Should().Be("Grievance.EmptyResolution");
    }
}
