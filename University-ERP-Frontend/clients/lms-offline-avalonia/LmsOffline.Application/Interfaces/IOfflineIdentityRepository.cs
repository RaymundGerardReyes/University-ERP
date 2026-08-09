namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface IOfflineIdentityRepository
{
    Task<StudentUser?> GetByEmailOrStudentIdAsync(string identifier, CancellationToken cancellationToken = default);
    Task<StudentUser?> GetActiveStudentAsync(CancellationToken cancellationToken = default);
    Task SaveStudentProfileAsync(StudentUser student, CancellationToken cancellationToken = default);
    Task AddAsync(StudentUser student, CancellationToken cancellationToken = default);
    Task UpdateAsync(StudentUser student, CancellationToken cancellationToken = default);
}