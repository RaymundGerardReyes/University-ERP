namespace Admissions.Domain.Entities;

using SharedKernel.Domain.Primitives;

public sealed class AdmissionDocument : Entity<string>
{
    public string Name { get; private set; }
    public string Status { get; private set; }
    public string? Feedback { get; private set; }
    public DateTime? UploadedAt { get; private set; }
    public string AdmissionApplicationId { get; private set; }

    private AdmissionDocument() : base() { }

    internal AdmissionDocument(string id, string admissionApplicationId, string name, string status)
        : base(id)
    {
        AdmissionApplicationId = admissionApplicationId;
        Name = name;
        Status = status;
    }

    public void MarkAsUploaded()
    {
        Status = "Uploaded";
        UploadedAt = DateTime.UtcNow;
        Feedback = null;
    }

    public void Review(string status, string? feedback)
    {
        Status = status;
        Feedback = feedback;
    }
}
