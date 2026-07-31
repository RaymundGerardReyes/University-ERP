using MediatR;

namespace StudentInformation.Application.Features.GetStudentInformation;

public sealed record StudentProfileDto(
    string Id,
    string FirstName,
    string LastName,
    string Email,
    string ProgramName,
    int CurrentSemester,
    double Cgpa,
    int TotalCreditsEarned,
    int EnrollmentYear,
    string PhoneNumber
);

public sealed record EnrollmentDto(
    string CourseCode,
    string CourseName,
    int Credits,
    string Status,
    string? Grade
);

public sealed record GetStudentProfileQuery(string StudentId) : IRequest<StudentProfileDto>;
public sealed record GetStudentEnrollmentsQuery(string StudentId) : IRequest<IReadOnlyList<EnrollmentDto>>;

public sealed class GetStudentProfileQueryHandler : IRequestHandler<GetStudentProfileQuery, StudentProfileDto>
{
    public Task<StudentProfileDto> Handle(GetStudentProfileQuery request, CancellationToken cancellationToken)
    {
        var mockProfile = new StudentProfileDto(
            request.StudentId,
            "Alex",
            "Morgan",
            "alex.morgan@university.edu",
            "B.S. Computer Science & Engineering",
            6,
            3.85,
            96,
            2023,
            "+1 (555) 234-5678"
        );

        return Task.FromResult(mockProfile);
    }
}

public sealed class GetStudentEnrollmentsQueryHandler : IRequestHandler<GetStudentEnrollmentsQuery, IReadOnlyList<EnrollmentDto>>
{
    public Task<IReadOnlyList<EnrollmentDto>> Handle(GetStudentEnrollmentsQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<EnrollmentDto> mockEnrollments = new List<EnrollmentDto>
        {
            new("CS-301", "Distributed Systems & Architecture", 4, "Active", "A"),
            new("CS-305", "Database Management & DBMA", 3, "Active", "A-"),
            new("MATH-202", "Linear Algebra & Applications", 3, "Active", "B+")
        };

        return Task.FromResult(mockEnrollments);
    }
}
