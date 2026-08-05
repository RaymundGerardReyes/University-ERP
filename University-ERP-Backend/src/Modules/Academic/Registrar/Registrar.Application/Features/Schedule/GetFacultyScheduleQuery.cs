namespace Registrar.Application.Features.Schedule;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Registrar.Application.Abstractions;
using System;

public sealed record FacultyScheduleItemDto(string Id, string CourseName, string Time, string Room);

public sealed record GetFacultyScheduleQuery(string FacultyId) : IRequest<IEnumerable<FacultyScheduleItemDto>>;

public sealed class GetFacultyScheduleQueryHandler : IRequestHandler<GetFacultyScheduleQuery, IEnumerable<FacultyScheduleItemDto>>
{
    private readonly IRegistrarRepository _repository;

    public GetFacultyScheduleQueryHandler(IRegistrarRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<FacultyScheduleItemDto>> Handle(GetFacultyScheduleQuery request, CancellationToken cancellationToken)
    {
        var schedule = await _repository.GetFacultyScheduleAsync(request.FacultyId, cancellationToken);
        var dtos = new List<FacultyScheduleItemDto>();

        foreach (var item in schedule)
        {
            dtos.Add(new FacultyScheduleItemDto(
                item.Id,
                item.CourseCode,
                item.Schedule,
                item.Room
            ));
        }

        return dtos;
    }
}
