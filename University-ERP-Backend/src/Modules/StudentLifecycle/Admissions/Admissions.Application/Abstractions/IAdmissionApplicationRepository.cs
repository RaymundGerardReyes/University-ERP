namespace Admissions.Application.Abstractions;

using Admissions.Domain.Aggregates;

public interface IAdmissionApplicationRepository
{
    Task<AdmissionApplication?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AdmissionApplication>> GetByApplicantIdAsync(string applicantId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AdmissionApplication>> GetAllAsync(CancellationToken cancellationToken = default);
    void Add(AdmissionApplication application);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}