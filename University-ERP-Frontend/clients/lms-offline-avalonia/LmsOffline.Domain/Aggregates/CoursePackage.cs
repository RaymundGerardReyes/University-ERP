namespace LmsOffline.Domain.Aggregates;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Represents a downloaded, versioned, and cryptographically signed course package (Steam-like model).
/// </summary>
public sealed class CoursePackage : AggregateRoot<Guid>
{
    public string CourseCode { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string VersionManifest { get; private set; } = string.Empty;
    public long SizeInBytes { get; private set; }
    public string Instructor { get; private set; } = string.Empty;
    public int CompletedLessons { get; private set; }
    public int TotalLessons { get; private set; }
    public string ExpectedSignature { get; private set; } = string.Empty;
    public bool IsVerified { get; private set; }
    public DateTime InstalledOnUtc { get; private set; }

    private CoursePackage() { }

    private CoursePackage(Guid id, string courseCode, string title, string versionManifest, long sizeInBytes, string expectedSignature, string instructor, int totalLessons) 
        : base(id)
    {
        CourseCode = courseCode;
        Title = title;
        VersionManifest = versionManifest;
        SizeInBytes = sizeInBytes;
        ExpectedSignature = expectedSignature;
        Instructor = instructor;
        TotalLessons = totalLessons;
        CompletedLessons = 0;
        IsVerified = false; // Must be explicitly verified by the Security layer before unlocking
        InstalledOnUtc = DateTime.UtcNow;
    }

    public static Result<CoursePackage> Install(string courseCode, string title, string versionManifest, long sizeInBytes, string signature, string instructor = "Dr. Alan Turing", int totalLessons = 10)
    {
        if (string.IsNullOrWhiteSpace(signature))
        {
            return Result<CoursePackage>.Failure(new Error("Package.Unsigned", "Course packages must contain a valid ECDSA signature."));
        }
        return Result<CoursePackage>.Success(new CoursePackage(Guid.NewGuid(), courseCode, title, versionManifest, sizeInBytes, signature, instructor, totalLessons));
    }

    public void MarkAsVerified() => IsVerified = true;
    public void MarkAsCorrupted() => IsVerified = false;
}