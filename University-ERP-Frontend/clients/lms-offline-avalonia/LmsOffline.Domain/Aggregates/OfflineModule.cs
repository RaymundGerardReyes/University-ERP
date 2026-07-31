namespace LmsOffline.Domain.Aggregates;

using System;

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

    private OfflineModule() { }
}