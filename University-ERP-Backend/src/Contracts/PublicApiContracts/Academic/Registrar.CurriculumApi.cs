namespace Contracts.PublicApiContracts.Academic;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Open Host Service contract exposed by the Registrar Bounded Context.
/// Used synchronously by LMS and Admissions to query active degree programs.
/// </summary>
public interface IRegistrarCurriculumApi
{
    Task<DegreeProgramDto> GetDegreeProgramAsync(string programCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<DegreeProgramDto>> GetAllActiveProgramsAsync(CancellationToken cancellationToken = default);
}

public sealed record DegreeProgramDto(
    string ProgramCode,
    string Name,
    string DepartmentId,
    int TotalCreditsRequired,
    bool IsActive
);
