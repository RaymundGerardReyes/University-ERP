namespace Examination.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class QuestionItem : AggregateRoot<Guid>
{
    public string SubjectPool { get; private set; } = string.Empty;
    public string QuestionText { get; private set; } = string.Empty;
    public string BloomsTaxonomyTag { get; private set; } = string.Empty;
    public decimal DifficultyIndex { get; private set; }
    public int Version { get; private set; }

    private QuestionItem() { }

    private QuestionItem(Guid id, string subjectPool, string text, string bloomsTag) : base(id)
    {
        SubjectPool = subjectPool;
        QuestionText = text;
        BloomsTaxonomyTag = bloomsTag;
        DifficultyIndex = 0.5m; // Default baseline
        Version = 1;
    }

    public static Result<QuestionItem> Create(string subject, string text, string bloomsTag)
    {
        return Result<QuestionItem>.Success(new QuestionItem(Guid.NewGuid(), subject, text, bloomsTag));
    }
}