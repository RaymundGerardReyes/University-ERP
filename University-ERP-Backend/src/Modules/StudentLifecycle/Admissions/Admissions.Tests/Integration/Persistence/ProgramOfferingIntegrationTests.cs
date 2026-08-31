namespace Admissions.Tests.Integration.Persistence;

using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;
using Admissions.Infrastructure.Repositories;

public class ProgramOfferingIntegrationTests : IDisposable
{
    private readonly AdmissionsDbContext _dbContext;
    private readonly ProgramOfferingRepository _programRepo;

    public ProgramOfferingIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<AdmissionsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new AdmissionsDbContext(options);
        _programRepo = new ProgramOfferingRepository(_dbContext);
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }

    [Fact]
    public async Task TC31_ProgramOfferingRepository_Should_AddAsync()
    {
        var program = new ProgramOffering("BSIT", "CCS", "BS", "IT", "4 Years", "Fall", "50000");
        
        _dbContext.ProgramOfferings.Add(program);
        await _dbContext.SaveChangesAsync();
        
        var saved = await _programRepo.GetByIdAsync("BSIT");
        
        saved.Should().NotBeNull();
        saved!.Major.Should().Be("IT");
    }

    [Fact]
    public async Task TC32_ProgramOfferingRepository_Should_GetByIdAsync()
    {
        _dbContext.ProgramOfferings.Add(new ProgramOffering("BSE", "COE", "BS", "Eng", "4 Years", "Fall", "50000"));
        await _dbContext.SaveChangesAsync();

        var result = await _programRepo.GetByIdAsync("BSE");
        
        result.Should().NotBeNull();
        result!.Degree.Should().Be("BS");
    }

    [Fact]
    public async Task TC33_ProgramOfferingRepository_Should_UpdateAsync()
    {
        var program = new ProgramOffering("BSBA", "CBA", "BS", "Business", "4 Years", "Fall", "50000");
        _dbContext.ProgramOfferings.Add(program);
        await _dbContext.SaveChangesAsync();

        program.AddTag("Accredited");
        _dbContext.ProgramOfferings.Update(program);
        await _dbContext.SaveChangesAsync();

        var updated = await _programRepo.GetByIdAsync("BSBA");
        
        updated!.Tags.Should().Contain("Accredited");
    }

    [Fact]
    public async Task TC34_ProgramOfferingRepository_Should_DeleteAsync()
    {
        var program = new ProgramOffering("BSN", "CON", "BS", "Nursing", "4 Years", "Fall", "50000");
        _dbContext.ProgramOfferings.Add(program);
        await _dbContext.SaveChangesAsync();

        _dbContext.ProgramOfferings.Remove(program);
        await _dbContext.SaveChangesAsync();

        var deleted = await _programRepo.GetByIdAsync("BSN");
        
        deleted.Should().BeNull();
    }
}
