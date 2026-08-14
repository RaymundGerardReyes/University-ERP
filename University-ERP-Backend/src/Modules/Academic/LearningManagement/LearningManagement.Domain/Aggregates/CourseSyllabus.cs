namespace LearningManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;

public sealed class CourseSyllabus : AggregateRoot<Guid>
{
    public string SectionId { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public bool IsPublished { get; private set; }

    private readonly List<LearningModule> _modules = new();
    public IReadOnlyCollection<LearningModule> Modules => _modules.AsReadOnly();

    private CourseSyllabus() { }

    public CourseSyllabus(Guid id, string sectionId, string title, string description) : base(id)
    {
        SectionId = sectionId;
        Title = title;
        Description = description;
        IsPublished = false;
    }

    public void AddModule(string moduleTitle, string moduleDescription, int orderSequence)
    {
        _modules.Add(new LearningModule(Guid.NewGuid(), moduleTitle, moduleDescription, orderSequence));
    }

    public void PublishSyllabus()
    {
        IsPublished = true;
    }
}

public sealed class LearningModule : Entity<Guid>
{
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public int OrderSequence { get; private set; }

    private readonly List<ContentItem> _contentItems = new();
    public IReadOnlyCollection<ContentItem> ContentItems => _contentItems.AsReadOnly();

    private LearningModule() { }

    internal LearningModule(Guid id, string title, string description, int orderSequence) : base(id)
    {
        Title = title;
        Description = description;
        OrderSequence = orderSequence;
    }

    public void AddContent(string name, string type, string url)
    {
        _contentItems.Add(new ContentItem(Guid.NewGuid(), name, type, url));
    }
}

public sealed class ContentItem : Entity<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public string ContentType { get; private set; } = string.Empty; // e.g., "Video", "PDF", "Quiz"
    public string ResourceUrl { get; private set; } = string.Empty;

    private ContentItem() { }

    internal ContentItem(Guid id, string name, string contentType, string resourceUrl) : base(id)
    {
        Name = name;
        ContentType = contentType;
        ResourceUrl = resourceUrl;
    }
}
