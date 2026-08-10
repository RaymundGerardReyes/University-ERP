namespace LmsOffline.Application.Interfaces;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface ILocalGradeRepository
{
    Task<List<GradeRecord>> GetByStudentIdAsync(string studentIdNumber, CancellationToken cancellationToken = default);
    Task UpsertAsync(GradeRecord grade, CancellationToken cancellationToken = default);
}
