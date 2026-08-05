namespace Examination.Domain.Aggregates;

public sealed class GradebookRecord
{
    public string Id { get; set; } = string.Empty;
    public string SectionId { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public decimal? Prelim { get; set; }
    public decimal? Midterm { get; set; }
    public decimal? Final { get; set; }
    public string Status { get; set; } = string.Empty;
}
