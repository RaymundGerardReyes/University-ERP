namespace Curriculum.Application.Abstractions;

using Curriculum.Domain.Aggregates;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public interface IAcademicProgramRepository
{
    Task<AcademicProgram?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<AcademicProgram?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AcademicProgram>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(AcademicProgram program, CancellationToken cancellationToken = default);
}

public interface ICurriculumPlanRepository
{
    Task<AcademicCurriculum?> GetActiveByProgramCodeAsync(string programCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AcademicCurriculum>> GetAllByProgramCodeAsync(string programCode, CancellationToken cancellationToken = default);
    Task AddAsync(AcademicCurriculum curriculum, CancellationToken cancellationToken = default);
}

