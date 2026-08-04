namespace Admissions.Domain.Aggregates;

using SharedKernel.Domain.Primitives;

public sealed class ProgramOffering : AggregateRoot<string>
{
    public string College { get; private set; }
    public string Degree { get; private set; }
    public string Major { get; private set; }
    public string Duration { get; private set; }
    public string Intake { get; private set; }
    public string TuitionEstimate { get; private set; }
    
    private readonly List<string> _tags = new();
    public IReadOnlyCollection<string> Tags => _tags.AsReadOnly();

    private ProgramOffering() : base() { }

    public ProgramOffering(string id, string college, string degree, string major, string duration, string intake, string tuitionEstimate)
        : base(id)
    {
        College = college;
        Degree = degree;
        Major = major;
        Duration = duration;
        Intake = intake;
        TuitionEstimate = tuitionEstimate;
    }

    public void AddTag(string tag)
    {
        if (!string.IsNullOrWhiteSpace(tag) && !_tags.Contains(tag))
        {
            _tags.Add(tag);
        }
    }
}
