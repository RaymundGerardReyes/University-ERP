namespace LearningManagement.Domain.Aggregates;

using System;
using SharedKernel.Domain.Primitives;

public sealed class Assessment : AggregateRoot<string>
{
    public Guid Id { get; set; } 
    public string Title { get; set; } = string.Empty;
    public DateTime DueDateUtc { get; set; }
    public int MaxScore { get; set; }

    // public string Id { get; private set; } 
    

    // 1. Add CourseCode to resolve the CS1061 error on line 63
    public string CourseCode { get; private set; } = string.Empty;

    // 2. Add LastModifiedUtc to resolve the CS1061 error on line 66
    public DateTime LastModifiedUtc { get; private set; }


    public void UpdateLastModified()
    {
        LastModifiedUtc = DateTime.UtcNow;
    }
    
}
