using MediatR;

namespace HealthCenter.Application.Features.GetHealthAppointments;

public sealed record HealthAppointmentDto(
    string Id,
    string DoctorName,
    string Specialty,
    string Date,
    string Time,
    string Status
);

public sealed record GetHealthAppointmentsQuery(string StudentId) : IRequest<IReadOnlyList<HealthAppointmentDto>>;

public sealed class GetHealthAppointmentsQueryHandler : IRequestHandler<GetHealthAppointmentsQuery, IReadOnlyList<HealthAppointmentDto>>
{
    public Task<IReadOnlyList<HealthAppointmentDto>> Handle(GetHealthAppointmentsQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<HealthAppointmentDto> mockAppointments = new List<HealthAppointmentDto>
        {
            new("HA-882", "Dr. Sarah Jenkins", "General Medicine", "2026-08-05", "10:30 AM", "Scheduled"),
            new("HA-410", "Dr. Robert Chen", "Dental Health", "2026-06-12", "02:00 PM", "Completed")
        };

        return Task.FromResult(mockAppointments);
    }
}
