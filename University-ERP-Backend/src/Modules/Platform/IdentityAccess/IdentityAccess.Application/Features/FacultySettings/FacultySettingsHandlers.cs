namespace IdentityAccess.Application.Features.FacultySettings;

using MediatR;
using SharedKernel.Domain.Primitives;
using System.Threading;
using System.Threading.Tasks;

// --- 1. DTO & QUERY (GET) ---
public sealed record FacultySettingsDto(
    string OfficeLocation,
    string ConsultationLink,
    bool EmailNotifications,
    bool SmsNotifications
);

public sealed record GetFacultySettingsQuery(string FacultyId) : IRequest<FacultySettingsDto>;

public sealed class GetFacultySettingsQueryHandler : IRequestHandler<GetFacultySettingsQuery, FacultySettingsDto>
{
    public Task<FacultySettingsDto> Handle(GetFacultySettingsQuery request, CancellationToken cancellationToken)
    {
        var mockSettings = new FacultySettingsDto(
            "Building A, Room 310",
            "https://meet.university.edu/faculty-310",
            true,
            false
        );
        return Task.FromResult(mockSettings);
    }
}

// --- 2. COMMAND (PATCH) ---
public sealed record UpdateFacultySettingsCommand(
    string FacultyId,
    string? OfficeLocation,
    string? ConsultationLink,
    bool? EmailNotifications,
    bool? SmsNotifications
) : IRequest<Result<bool>>;

public sealed class UpdateFacultySettingsCommandHandler : IRequestHandler<UpdateFacultySettingsCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(UpdateFacultySettingsCommand request, CancellationToken cancellationToken)
    {
        // DBMA Implementation: Fetch User aggregate, update preferences, and save to IUserRepository.
        return Task.FromResult(Result<bool>.Success(true));
    }
}