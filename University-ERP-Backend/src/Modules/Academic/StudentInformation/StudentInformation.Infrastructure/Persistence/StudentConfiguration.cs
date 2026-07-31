namespace StudentInformation.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;

/// <summary>
/// Configures the database schema mapping for the Student aggregate.
/// </summary>
internal sealed class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        // Enforce DBMA schema isolation
        builder.ToTable("Students", "academic");

        builder.HasKey(s => s.Id);

        // Tell EF Core how to convert our strongly-typed StudentId into a Guid for SQL
        builder.Property(s => s.Id)
            .HasConversion(
                studentId => studentId.Value,
                value => StudentId.From(value));

        // IdentityUserId remains a Guid, linking to the Identity module without domain coupling
        builder.Property(s => s.IdentityUserId)
            .IsRequired();

        builder.Property(s => s.EnrollmentNumber)
            .HasMaxLength(20)
            .IsRequired();

        // Convert the Enum to a string for readability in the database
        builder.Property(s => s.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(s => s.EnrolledOnUtc)
            .IsRequired();

        // Ensure Enrollment numbers are unique at the database level
        builder.HasIndex(s => s.EnrollmentNumber).IsUnique();
    }
}
