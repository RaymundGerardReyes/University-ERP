namespace UniversityErp.Tests.EndToEnd;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using MediatR;

using GrievanceManagement.Domain.Aggregates;
using GrievanceManagement.Application.Abstractions;
using GrievanceManagement.Application.Features.SubmitComplaint;
using GrievanceManagement.Application.Features.EscalateComplaint;
using Contracts.IntegrationEvents.Governance;
using Facilities.Application.Consumers;

public class GrievanceToFacilitiesFlow
{
    [Fact]
    public async Task GrievanceSubmissionAndEscalation_DispatchesToFacilities_EndToEnd()
    {
        // ─── 1. Setup Isolated In-Memory Persistence & Repositories ───────────
        var grievanceRepo = new InMemoryGrievanceRepository();
        var facilitiesEventLog = new List<GrievanceSubmittedIntegrationEvent>();

        // ─── 2. Setup Real-time In-Process Event Dispatcher ───────────────────
        var publishedEvents = new List<object>();
        var testPublisher = new TestPublisher(publishedEvents, async (evt, ct) =>
        {
            if (evt is GrievanceSubmittedIntegrationEvent grievanceEvent)
            {
                facilitiesEventLog.Add(grievanceEvent);
                var consumer = new GrievanceSubmittedIntegrationEventConsumer(
                    NullLogger<GrievanceSubmittedIntegrationEventConsumer>.Instance);
                await consumer.Handle(grievanceEvent, ct);
            }
        });

        // ─── STEP 1: Student Submits Facilities Grievance ──────────────────────
        var complainantId = Guid.NewGuid().ToString();
        var submitHandler = new SubmitComplaintCommandHandler(grievanceRepo);

        var submitResult = await submitHandler.Handle(new SubmitComplaintCommand(
            complainantId,
            "Facilities",
            "Science Complex Room 204 electrical socket is sparking."
        ), CancellationToken.None);

        submitResult.IsSuccess.Should().BeTrue();
        var complaintId = submitResult.Value;

        var complaint = await grievanceRepo.GetByIdAsync(complaintId);
        complaint.Should().NotBeNull();
        complaint!.Status.Should().Be("PendingReview");
        complaint.Category.Should().Be("Facilities");

        // ─── STEP 2: Officer Begins Investigation & Escalates to Facilities ───
        var beginInvestigateResult = complaint.BeginInvestigation();
        beginInvestigateResult.IsSuccess.Should().BeTrue();
        complaint.Status.Should().Be("UnderInvestigation");
        await grievanceRepo.UpdateAsync(complaint);

        var escalateHandler = new EscalateComplaintCommandHandler(grievanceRepo, testPublisher);
        var escalateResult = await escalateHandler.Handle(new EscalateComplaintCommand(
            complaintId,
            "Facilities",
            "Critical",
            "Hazardous electrical hazard requiring immediate electrician dispatch."
        ), CancellationToken.None);

        escalateResult.IsSuccess.Should().BeTrue();

        var escalatedComplaint = await grievanceRepo.GetByIdAsync(complaintId);
        escalatedComplaint!.Status.Should().Be("Escalated");
        escalatedComplaint.Priority.Should().Be("Critical");
        escalatedComplaint.AssignedDepartment.Should().Be("Facilities");

        // ─── STEP 3: Verify Facilities Integration Event Interception ─────────
        publishedEvents.Should().ContainSingle(e => e is GrievanceSubmittedIntegrationEvent);
        facilitiesEventLog.Should().ContainSingle();
        var loggedEvent = facilitiesEventLog.Single();
        loggedEvent.GrievanceId.Should().Be(complaintId);
        loggedEvent.Category.Should().Be("Facilities");
        loggedEvent.Priority.Should().Be("Critical");

        // ─── STEP 4: Complete Resolution Workflow ─────────────────────────────
        var resolveResult = escalatedComplaint.Resolve("Electrical circuit breaker replaced and safety tested.");
        resolveResult.IsSuccess.Should().BeTrue();
        escalatedComplaint.Status.Should().Be("Resolved");
        escalatedComplaint.ResolutionNotes.Should().Contain("replaced and safety tested");
        escalatedComplaint.ResolvedOnUtc.Should().NotBeNull();
        await grievanceRepo.UpdateAsync(escalatedComplaint);
    }

    [Fact]
    public async Task Regression_EscalatingResolvedComplaint_Fails()
    {
        var grievanceRepo = new InMemoryGrievanceRepository();
        var publishedEvents = new List<object>();
        var testPublisher = new TestPublisher(publishedEvents, (evt, ct) => Task.CompletedTask);

        var submitHandler = new SubmitComplaintCommandHandler(grievanceRepo);
        var submitResult = await submitHandler.Handle(new SubmitComplaintCommand(
            Guid.NewGuid().ToString(), "Facilities", "HVAC repair needed"
        ), CancellationToken.None);

        var complaint = await grievanceRepo.GetByIdAsync(submitResult.Value);
        complaint!.Resolve("Fixed previously");
        await grievanceRepo.UpdateAsync(complaint);

        var escalateHandler = new EscalateComplaintCommandHandler(grievanceRepo, testPublisher);
        var escalateResult = await escalateHandler.Handle(new EscalateComplaintCommand(
            complaint.Id, "Facilities", "Normal", "Try re-escalating"
        ), CancellationToken.None);

        escalateResult.IsFailure.Should().BeTrue();
        escalateResult.Error.Code.Should().Be("Grievance.AlreadyResolved");
        publishedEvents.Should().BeEmpty();
    }

    [Fact]
    public async Task Regression_EmptyDescription_RejectsComplaint()
    {
        var grievanceRepo = new InMemoryGrievanceRepository();
        var submitHandler = new SubmitComplaintCommandHandler(grievanceRepo);

        var submitResult = await submitHandler.Handle(new SubmitComplaintCommand(
            Guid.NewGuid().ToString(), "Facilities", ""
        ), CancellationToken.None);

        submitResult.IsFailure.Should().BeTrue();
        submitResult.Error.Code.Should().Be("Grievance.EmptyDescription");
    }

    private sealed class InMemoryGrievanceRepository : IGrievanceRepository
    {
        private readonly List<Complaint> _complaints = new();

        public Task<Complaint?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_complaints.FirstOrDefault(c => c.Id == id));
        }

        public Task AddAsync(Complaint complaint, CancellationToken cancellationToken = default)
        {
            _complaints.Add(complaint);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Complaint complaint, CancellationToken cancellationToken = default)
        {
            var idx = _complaints.FindIndex(c => c.Id == complaint.Id);
            if (idx >= 0) _complaints[idx] = complaint;
            return Task.CompletedTask;
        }
    }
}

