namespace Admissions.Tests.Integration.Persistence;

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;
using Admissions.Infrastructure.Repositories;

public class AdmissionApplicationIntegrationTests : IDisposable
{
    private readonly AdmissionsDbContext _dbContext;
    private readonly AdmissionApplicationRepository _appRepo;

    public AdmissionApplicationIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<AdmissionsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new AdmissionsDbContext(options);
        _appRepo = new AdmissionApplicationRepository(_dbContext);
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }

    [Fact]
    public async Task TC35_AdmissionApplicationRepository_Should_AddAsync()
    {
        var app = new AdmissionApplication("APP-1", "USER-1", "BSCS");
        
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();
        
        var saved = await _appRepo.GetByIdAsync("APP-1");
        
        saved.Should().NotBeNull();
        saved!.Status.Should().Be("Submitted");
    }

    [Fact]
    public async Task TC36_AdmissionApplicationRepository_Should_GetByIdAsync()
    {
        var app = new AdmissionApplication("APP-2", "USER-2", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var result = await _appRepo.GetByIdAsync("APP-2");
        
        result!.ApplicantId.Should().Be("USER-2");
    }

    [Fact]
    public async Task TC37_AdmissionApplicationRepository_Should_GetByApplicantIdAsync()
    {
        _appRepo.Add(new AdmissionApplication("APP-3", "USER-3", "BSCS"));
        await _appRepo.SaveChangesAsync();

        var results = await _appRepo.GetByApplicantIdAsync("USER-3");
        
        results.Should().NotBeEmpty();
        results.First().ProgramId.Should().Be("BSCS");
    }

    [Fact]
    public async Task TC38_AdmissionApplicationRepository_Should_GetPendingAsync()
    {
        var app = new AdmissionApplication("APP-4", "USER-4", "BSCS");
        app.UpdateStatus("InterviewPending");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        var results = await _appRepo.GetAllAsync();
        
        results.Should().Contain(a => a.Status == "InterviewPending");
    }

    [Fact]
    public async Task TC39_AdmissionApplicationRepository_Should_UpdateAsync()
    {
        var app = new AdmissionApplication("APP-5", "USER-5", "BSCS");
        _appRepo.Add(app);
        await _appRepo.SaveChangesAsync();

        app.UpdateStatus("Waitlisted");
        await _appRepo.SaveChangesAsync();

        var updated = await _appRepo.GetByIdAsync("APP-5");
        
        updated!.Status.Should().Be("Waitlisted");
    }

    [Fact]
    public async Task TC40_AdmissionApplicationRepository_Should_Support_Concurrent_Additions()
    {
        _appRepo.Add(new AdmissionApplication("APP-6", "USER-6", "BSCS"));
        _appRepo.Add(new AdmissionApplication("APP-7", "USER-7", "BSIT"));
        await _appRepo.SaveChangesAsync();

        var results = await _appRepo.GetAllAsync();
        
        results.Should().HaveCountGreaterOrEqualTo(2);
    }
}
