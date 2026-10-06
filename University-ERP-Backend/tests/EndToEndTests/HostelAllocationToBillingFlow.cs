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

using Hostel.Domain.Aggregates;
using Hostel.Application.Abstractions;
using Hostel.Application.Features.AllocateRoom;
using Contracts.IntegrationEvents.StudentLifecycle;

using Finance.Domain.Aggregates;
using Finance.Infrastructure.Persistence;
using Finance.Infrastructure.Repositories;
using Finance.Application.Consumers;

public class HostelAllocationToBillingFlow
{
    [Fact]
    public async Task HostelRoomAllocation_TriggersFinanceAssessment_EndToEnd()
    {
        // ─── 1. Setup Isolated In-Memory Persistence & Repositories ───────────
        var dbId = Guid.NewGuid().ToString();
        var financeOptions = new DbContextOptionsBuilder<FinanceDbContext>()
            .UseInMemoryDatabase($"Finance_Hostel_{dbId}")
            .Options;
        var financeDb = new FinanceDbContext(financeOptions);
        var billingRepo = new StudentBillingRepository(financeDb);

        var hostelRepo = new InMemoryRoomAllocationRepository();

        // ─── 2. Setup Real-time In-Process Event Dispatcher ───────────────────
        var publishedEvents = new List<object>();
        var testPublisher = new TestPublisher(publishedEvents, async (evt, ct) =>
        {
            if (evt is RoomAllocatedIntegrationEvent roomEvent)
            {
                var consumer = new RoomAllocatedIntegrationEventConsumer(
                    billingRepo,
                    NullLogger<RoomAllocatedIntegrationEventConsumer>.Instance);
                await consumer.Handle(roomEvent, ct);
            }
        });

        // ─── STEP 1: Allocate Hostel Room to Student ──────────────────────────
        var studentId = Guid.NewGuid();
        var allocateHandler = new AllocateRoomCommandHandler(hostelRepo, testPublisher);

        var command = new AllocateRoomCommand(
            StudentId: studentId,
            HostelName: "Euler Hall of Residence",
            RoomNumber: "305-A",
            RoomType: "Double Occupancy",
            MonthlyFee: 650.00m,
            Capacity: 2
        );

        var result = await allocateHandler.Handle(command, CancellationToken.None);

        // Assert allocation succeeded
        result.IsSuccess.Should().BeTrue();
        var allocationId = result.Value;

        var storedAllocation = await hostelRepo.GetByIdAsync(allocationId);
        storedAllocation.Should().NotBeNull();
        storedAllocation!.Status.Should().Be("Allocated");
        storedAllocation.HostelName.Should().Be("Euler Hall of Residence");
        storedAllocation.RoomNumber.Should().Be("305-A");
        storedAllocation.CurrentOccupancy.Should().Be(1);

        // ─── STEP 2: Assert Event Dispatch & Finance Integration ──────────────
        publishedEvents.Should().ContainSingle(e => e is RoomAllocatedIntegrationEvent);
        var dispatchedEvent = publishedEvents.OfType<RoomAllocatedIntegrationEvent>().Single();
        dispatchedEvent.StudentId.Should().Be(studentId);
        dispatchedEvent.MonthlyFee.Should().Be(650.00m);

        // Assert Finance received and generated the student's ledger invoice
        var studentBilling = await billingRepo.GetByStudentIdAsync(studentId);
        studentBilling.Should().NotBeNull();
        studentBilling!.TotalAmount.Should().Be(650.00m);
        studentBilling.Description.Should().Contain("Euler Hall of Residence Room 305-A");
        studentBilling.Status.Should().Be("Unpaid");
    }

    [Fact]
    public async Task Regression_ExceedingRoomCapacity_RejectsAllocation()
    {
        var hostelRepo = new InMemoryRoomAllocationRepository();
        var publishedEvents = new List<object>();
        var testPublisher = new TestPublisher(publishedEvents, (evt, ct) => Task.CompletedTask);

        var allocateHandler = new AllocateRoomCommandHandler(hostelRepo, testPublisher);

        // 1. Fill room to capacity (Capacity = 1)
        var student1 = Guid.NewGuid();
        var result1 = await allocateHandler.Handle(new AllocateRoomCommand(
            student1, "Newton Tower", "101", "Single Occupancy", 800.00m, 1), CancellationToken.None);
        result1.IsSuccess.Should().BeTrue();

        // 2. Attempt second allocation to same room exceeding capacity
        var student2 = Guid.NewGuid();
        var result2 = await allocateHandler.Handle(new AllocateRoomCommand(
            student2, "Newton Tower", "101", "Single Occupancy", 800.00m, 1), CancellationToken.None);

        // Invariant: Must fail with Hostel.RoomCapacityExceeded
        result2.IsFailure.Should().BeTrue();
        result2.Error.Code.Should().Be("Hostel.RoomCapacityExceeded");
        publishedEvents.Should().HaveCount(1, "second allocation must NOT emit event");
    }

    [Fact]
    public async Task Regression_DuplicateStudentAllocation_RejectsAllocation()
    {
        var hostelRepo = new InMemoryRoomAllocationRepository();
        var publishedEvents = new List<object>();
        var testPublisher = new TestPublisher(publishedEvents, (evt, ct) => Task.CompletedTask);

        var allocateHandler = new AllocateRoomCommandHandler(hostelRepo, testPublisher);
        var studentId = Guid.NewGuid();

        // First allocation succeeds
        var result1 = await allocateHandler.Handle(new AllocateRoomCommand(
            studentId, "Gauss Hall", "201", "Double Occupancy", 500.00m, 2), CancellationToken.None);
        result1.IsSuccess.Should().BeTrue();

        // Second allocation for same student must be rejected
        var result2 = await allocateHandler.Handle(new AllocateRoomCommand(
            studentId, "Gauss Hall", "202", "Double Occupancy", 500.00m, 2), CancellationToken.None);

        result2.IsFailure.Should().BeTrue();
        result2.Error.Code.Should().Be("Hostel.AlreadyAllocated");
    }

    private sealed class InMemoryRoomAllocationRepository : IRoomAllocationRepository
    {
        private readonly List<RoomAllocation> _allocations = new();

        public Task<RoomAllocation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_allocations.FirstOrDefault(a => a.Id == id));
        }

        public Task<RoomAllocation?> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_allocations.FirstOrDefault(a => a.StudentId == studentId && a.Status != "Vacated"));
        }

        public Task<int> GetRoomOccupancyAsync(string hostelName, string roomNumber, CancellationToken cancellationToken = default)
        {
            var count = _allocations.Count(a => 
                a.HostelName == hostelName && 
                a.RoomNumber == roomNumber && 
                a.Status != "Vacated");
            return Task.FromResult(count);
        }

        public Task AddAsync(RoomAllocation allocation, CancellationToken cancellationToken = default)
        {
            _allocations.Add(allocation);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(RoomAllocation allocation, CancellationToken cancellationToken = default)
        {
            var idx = _allocations.FindIndex(a => a.Id == allocation.Id);
            if (idx >= 0) _allocations[idx] = allocation;
            return Task.CompletedTask;
        }
    }
}

