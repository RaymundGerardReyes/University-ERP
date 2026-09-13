namespace Curriculum.Infrastructure.Persistence;

using Curriculum.Application.Abstractions;
using Curriculum.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed class CurriculumDbContext : DbContext, ICourseDefinitionRepository
{
    public CurriculumDbContext(DbContextOptions<CurriculumDbContext> options) : base(options)
    {
    }

    // ─── Existing ─────────────────────────────────────────────────────────────
    public DbSet<CourseDefinition> Courses { get; set; } = null!;
    public DbSet<CourseDefinition> CourseDefinitions { get => Courses; set => Courses = value; }
    public DbSet<PrerequisiteRule> Prerequisites { get; set; } = null!;

    // ─── New normalized curriculum ─────────────────────────────────────────────
    public DbSet<AcademicProgram> AcademicPrograms { get; set; } = null!;
    public DbSet<AcademicCurriculum> AcademicCurricula { get; set; } = null!;
    public DbSet<CurriculumSubject> CurriculumSubjects { get; set; } = null!;

    // ─── ICourseDefinitionRepository ──────────────────────────────────────────

    public async Task<CourseDefinition?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await Courses
            .Include(c => c.Prerequisites)
            .FirstOrDefaultAsync(c => c.Code == code, cancellationToken);
    }

    public async Task<CourseDefinition?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!Guid.TryParse(id, out var guid))
            return null;

        return await Courses
            .Include(c => c.Prerequisites)
            .FirstOrDefaultAsync(c => c.Id == guid, cancellationToken);
    }

    public async Task<CourseDefinition?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Courses
            .Include(c => c.Prerequisites)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<CourseDefinition>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await Courses
            .Include(c => c.Prerequisites)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(CourseDefinition course, CancellationToken cancellationToken = default)
    {
        await Courses.AddAsync(course, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CourseDefinition course, CancellationToken cancellationToken = default)
    {
        foreach (var prereq in course.Prerequisites)
        {
            var entry = Entry(prereq);
            if (entry.State == EntityState.Detached)
            {
                entry.State = EntityState.Added;
            }
            else if (entry.State == EntityState.Modified)
            {
                var exists = await Prerequisites.AnyAsync(p => p.Id == prereq.Id, cancellationToken);
                if (!exists)
                {
                    entry.State = EntityState.Added;
                }
            }
        }

        await SaveChangesAsync(cancellationToken);
    }

    // ─── EF Core Model Configuration ──────────────────────────────────────────

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Existing: CourseDefinition (Subject catalog)
        modelBuilder.Entity<CourseDefinition>(entity =>
        {
            entity.ToTable("Courses", "curriculum");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Code).IsRequired().HasMaxLength(20);

            entity.HasMany(c => c.Prerequisites)
                  .WithOne()
                  .HasForeignKey("CourseDefinitionId")
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Navigation(c => c.Prerequisites).AutoInclude();
        });

        modelBuilder.Entity<PrerequisiteRule>(entity =>
        {
            entity.ToTable("PrerequisiteRules", "curriculum");
            entity.HasKey(p => p.Id);
        });

        // New: AcademicProgram
        modelBuilder.Entity<AcademicProgram>(entity =>
        {
            entity.ToTable("AcademicPrograms", "curriculum");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Code).IsRequired().HasMaxLength(20);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(256);
            entity.Property(p => p.College).IsRequired().HasMaxLength(256);
            entity.HasIndex(p => p.Code).IsUnique();
        });

        // New: AcademicCurriculum
        modelBuilder.Entity<AcademicCurriculum>(entity =>
        {
            entity.ToTable("AcademicCurricula", "curriculum");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.ProgramCode).IsRequired().HasMaxLength(20);
            entity.Property(c => c.AcademicYear).IsRequired().HasMaxLength(20);
            entity.Property(c => c.Version).IsRequired().HasMaxLength(10);
            entity.Property(c => c.Status).IsRequired().HasMaxLength(20);

            entity.HasMany(c => c.CurriculumSubjects)
                  .WithOne()
                  .HasForeignKey(cs => cs.CurriculumId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Navigation(c => c.CurriculumSubjects).AutoInclude();
        });

        // New: CurriculumSubject (join)
        modelBuilder.Entity<CurriculumSubject>(entity =>
        {
            entity.ToTable("CurriculumSubjects", "curriculum");
            entity.HasKey(cs => cs.Id);
            entity.Property(cs => cs.SubjectCode).IsRequired().HasMaxLength(20);
            entity.Property(cs => cs.Semester).IsRequired().HasMaxLength(20);
        });
    }
}
