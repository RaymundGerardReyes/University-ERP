namespace AcademicScheduling.Application.Features.SubmitAttendance;

using MediatR;
using SharedKernel.Domain.Primitives;
using System.Threading;
using System.Threading.Tasks;
using System;
using AcademicScheduling.Application.Abstractions;

// 1. The CQRS Command Payload
// Using 'object' for AttendanceData temporarily; this should be strongly typed to a specific DTO later
public sealed record SubmitAttendanceCommand(string SectionId, object AttendanceData) : IRequest<Result<bool>>;

// 2. The Command Handler
public sealed class SubmitAttendanceCommandHandler : IRequestHandler<SubmitAttendanceCommand, Result<bool>>
{
    private readonly IAcademicSchedulingRepository _repository;

    public SubmitAttendanceCommandHandler(IAcademicSchedulingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(SubmitAttendanceCommand request, CancellationToken cancellationToken)
    {
        var record = new AcademicScheduling.Domain.Aggregates.AttendanceRecord
        {
            Id = Guid.NewGuid(),
            SectionId = request.SectionId,
            Data = request.AttendanceData?.ToString() ?? "{}",
            SubmittedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAttendanceRecordAsync(record, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}