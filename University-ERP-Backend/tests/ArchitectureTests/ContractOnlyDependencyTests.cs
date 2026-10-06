namespace UniversityErp.Tests.Architecture;

using Xunit;
using FluentAssertions;
using System.IO;
using System.Xml.Linq;
using System.Linq;

public class ContractOnlyDependencyTests
{
    private static readonly string RepoRoot = FindRepoRoot();

    [Fact]
    public void UniversityErpContracts_OnlyReferencesSharedKernelDomain()
    {
        var contractsCsproj = Path.Combine(RepoRoot, "University-ERP-Backend", "src", "Contracts", "UniversityErp.Contracts.csproj");
        File.Exists(contractsCsproj).Should().BeTrue();

        var doc = XDocument.Load(contractsCsproj);
        var projectReferences = doc.Descendants("ProjectReference")
            .Select(pr => pr.Attribute("Include")?.Value)
            .Where(val => !string.IsNullOrEmpty(val))
            .ToList();

        foreach (var reference in projectReferences)
        {
            reference.Should().Contain("SharedKernel.Domain",
                because: "Contracts project should be pure and depend solely on SharedKernel domain abstractions.");
            reference.Should().NotContain("Modules",
                because: "Contracts project must never depend on any module implementation.");
        }
    }

    [Fact]
    public void IntegrationEvents_AreOrganizedByDomainCluster()
    {
        var eventsDir = Path.Combine(RepoRoot, "University-ERP-Backend", "src", "Contracts", "IntegrationEvents");
        Directory.Exists(eventsDir).Should().BeTrue();

        var clusterDirs = Directory.GetDirectories(eventsDir).Select(Path.GetFileName).ToList();
        clusterDirs.Should().Contain(new[] { "Academic", "Administration", "Governance", "Platform", "StudentLifecycle" });

        var eventFiles = Directory.GetFiles(eventsDir, "*IntegrationEvent.cs", SearchOption.AllDirectories);
        eventFiles.Length.Should().BeGreaterThan(10, because: "Core integration events must be populated across domain clusters.");
    }

    private static string FindRepoRoot()
    {
        var candidates = new[] { AppContext.BaseDirectory, Directory.GetCurrentDirectory() };
        foreach (var start in candidates)
        {
            var dir = start;
            while (!string.IsNullOrEmpty(dir))
            {
                if (File.Exists(Path.Combine(dir, "UniversityErp.slnx")))
                {
                    return dir;
                }
                var parent = Directory.GetParent(dir);
                if (parent == null) break;
                dir = parent.FullName;
            }
        }
        return "d:\\University-ERP";
    }
}

