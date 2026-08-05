namespace Examination.Application.Abstractions;

using Examination.Domain.Aggregates;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public interface IExaminationRepository
{
    Task<IReadOnlyList<GradebookRecord>> GetGradebookBySectionAsync(string sectionId, CancellationToken cancellationToken);
}
