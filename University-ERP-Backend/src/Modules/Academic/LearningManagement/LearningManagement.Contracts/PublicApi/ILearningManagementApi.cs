namespace LearningManagement.Contracts.PublicApi;

/// <summary>
/// Public API surface exposed to other modules for querying LMS module state.
/// </summary>
public interface ILearningManagementApi
{
    /// <summary>
    /// Checks whether a module is currently within its offline availability window.
    /// </summary>
    Task<bool> IsModuleAvailableAsync(string moduleId, DateTimeOffset checkTime, CancellationToken cancellationToken = default);
}
