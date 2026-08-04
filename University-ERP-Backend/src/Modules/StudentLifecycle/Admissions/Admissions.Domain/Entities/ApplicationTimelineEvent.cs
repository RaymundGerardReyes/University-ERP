namespace Admissions.Domain.Entities;

using SharedKernel.Domain.Primitives;

public sealed class ApplicationTimelineEvent : Entity<string>
{
    public string Title { get; private set; }
    public string Description { get; private set; }
    public string Status { get; private set; }
    public DateTime? DateCompleted { get; private set; }
    public string AdmissionApplicationId { get; private set; }

    private ApplicationTimelineEvent() : base() { }

    internal ApplicationTimelineEvent(string id, string admissionApplicationId, string title, string description, string status, DateTime? dateCompleted = null)
        : base(id)
    {
        AdmissionApplicationId = admissionApplicationId;
        Title = title;
        Description = description;
        Status = status;
        DateCompleted = dateCompleted;
    }

    public void MarkCompleted(DateTime date)
    {
        Status = "Completed";
        DateCompleted = date;
    }

    public void Activate()
    {
        if (Status == "Locked")
        {
            Status = "Active";
        }
    }
}
