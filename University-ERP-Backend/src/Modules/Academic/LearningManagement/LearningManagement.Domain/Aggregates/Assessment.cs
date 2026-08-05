namespace LearningManagement.Domain.Aggregates;

using System;

public sealed class Assessment
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime DueDateUtc { get; set; }
    public int MaxScore { get; set; }
}
