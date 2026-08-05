namespace StudentInformation.Application.Features.GetMyStudents;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StudentInformation.Application.Abstractions;
using System;

public sealed record StudentDto(
    string StudentId, 
    string Name, 
    string Program, 
    int YearLevel, 
    string Status
);

public sealed record GetMyStudentsQuery(string FacultyId) : IRequest<IReadOnlyList<StudentDto>>;

public sealed class GetMyStudentsQueryHandler : IRequestHandler<GetMyStudentsQuery, IReadOnlyList<StudentDto>>
{
    private readonly IStudentRepository _repository;

    public GetMyStudentsQueryHandler(IStudentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<StudentDto>> Handle(GetMyStudentsQuery request, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(request.FacultyId, out var parsedGuid))
        {
            var advisees = await _repository.GetAdviseesByFacultyIdAsync(parsedGuid, cancellationToken);
            var dtos = new List<StudentDto>();
            foreach (var a in advisees)
            {
                dtos.Add(new StudentDto(
                    a.StudentId,
                    a.StudentName,
                    a.Program,
                    a.DegreeProgress / 25, // Mock YearLevel based on degree progress
                    a.Status
                ));
            }
            return dtos;
        }

        return new List<StudentDto>();
    }
}
