namespace UniversityErp.Tests.Architecture;

using Xunit;
using FluentAssertions;
using System.IO;
using System.Xml.Linq;
using System.Linq;

public class SharedKernelPurityTests
{
    private static readonly string RepoRoot = FindRepoRoot();

    [Fact]
    public void SharedKernel_MustNotReferenceAnyDomainModule()
    {
        var sharedKernelDir = Path.Combine(RepoRoot, "University-ERP-Backend", "src", "SharedKernel");
        Directory.Exists(sharedKernelDir).Should().BeTrue();

        var sharedKernelCsprojs = Directory.GetFiles(sharedKernelDir, "*.csproj", SearchOption.AllDirectories);
        sharedKernelCsprojs.Should().NotBeEmpty();

        foreach (var csproj in sharedKernelCsprojs)
        {
            var doc = XDocument.Load(csproj);
            var projectReferences = doc.Descendants("ProjectReference")
                .Select(pr => pr.Attribute("Include")?.Value)
                .Where(val => !string.IsNullOrEmpty(val))
                .ToList();

            foreach (var reference in projectReferences)
            {
                reference.Should().NotContain("Modules",
                    because: $"SharedKernel project '{Path.GetFileName(csproj)}' must be pure and never reference any domain module in 'Modules/'.");
            }
        }
    }

    [Fact]
    public void SharedKernel_MustNotReferenceUniversityErpApi()
    {
        var sharedKernelDir = Path.Combine(RepoRoot, "University-ERP-Backend", "src", "SharedKernel");
        var sharedKernelCsprojs = Directory.GetFiles(sharedKernelDir, "*.csproj", SearchOption.AllDirectories);

        foreach (var csproj in sharedKernelCsprojs)
        {
            var doc = XDocument.Load(csproj);
            var projectReferences = doc.Descendants("ProjectReference")
                .Select(pr => pr.Attribute("Include")?.Value)
                .Where(val => !string.IsNullOrEmpty(val))
                .ToList();

            foreach (var reference in projectReferences)
            {
                reference.Should().NotContain("UniversityErp.Api",
                    because: "SharedKernel must never reference the API host project.");
            }
        }
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

