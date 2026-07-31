namespace LmsOffline.Domain.Aggregates;

using System;

/// <summary>
/// Represents a downloaded course module package (e.g., "Week 1: Biology").
/// </summary>
public sealed class OfflineModule
{
    public Guid Id { get; private set; }
    public string CourseName { get; private set; }
    public string ModuleTitle { get; private set; }
    public DateTime DownloadedAtUtc { get; private set; }

    public OfflineModule(Guid id, string courseName, string moduleTitle)
    {
        Id = id;
        CourseName = courseName;
        ModuleTitle = moduleTitle;
        DownloadedAtUtc = DateTime.UtcNow;
    }

    private OfflineModule() { } // Required for EF Core
}
