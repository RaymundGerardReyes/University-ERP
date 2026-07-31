namespace DocumentManagement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class CorporateDocument : AggregateRoot<Guid>
{
    public string Title { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string FilePath { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public string UploadedBy { get; private set; } = string.Empty;
    public DateTime UploadedOnUtc { get; private set; }

    private CorporateDocument() { }

    private CorporateDocument(Guid id, string title, string category, string filePath, string uploadedBy) : base(id)
    {
        Title = title;
        Category = category;
        FilePath = filePath;
        Status = "Draft";
        UploadedBy = uploadedBy;
        UploadedOnUtc = DateTime.UtcNow;
    }

    public static Result<CorporateDocument> Upload(string title, string category, string filePath, string uploadedBy)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Result<CorporateDocument>.Failure(new Error("Document.InvalidTitle", "Title is required."));
            
        if (string.IsNullOrWhiteSpace(filePath))
            return Result<CorporateDocument>.Failure(new Error("Document.InvalidPath", "File path is required."));

        return Result<CorporateDocument>.Success(new CorporateDocument(Guid.NewGuid(), title, category, filePath, uploadedBy));
    }

    public void Approve()
    {
        Status = "Approved";
    }
}
