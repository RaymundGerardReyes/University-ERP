namespace StudentInformation.Application.Features.GetAdvisees;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StudentInformation.Application.Abstractions;
using System;
// 1. DTO perfectly matching the frontend 'Advisee' interface
public sealed record AdviseeDto(
    string StudentId, 
    string Name, 
    string Program, 
    int DegreeProgress, 
    string Status
);

// 2. The MediatR Query
public sealed record GetAdviseesQuery(string FacultyId) : IRequest<IReadOnlyList<AdviseeDto>>;

// 3. The Handler
public sealed class GetAdviseesQueryHandler : IRequestHandler<GetAdviseesQuery, IReadOnlyList<AdviseeDto>>
{
    private readonly IStudentRepository _repository;

    public GetAdviseesQueryHandler(IStudentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<AdviseeDto>> Handle(GetAdviseesQuery request, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(request.FacultyId, out var parsedGuid))
        {
            var advisees = await _repository.GetAdviseesByFacultyIdAsync(parsedGuid, cancellationToken);
            var dtos = new List<AdviseeDto>();
            foreach (var a in advisees)
            {
                dtos.Add(new AdviseeDto(
                    a.StudentId,
                    a.StudentName,
                    a.Program,
                    a.DegreeProgress,
                    a.Status
                ));
            }
            return dtos;
        }

        return new List<AdviseeDto>();
    }
}