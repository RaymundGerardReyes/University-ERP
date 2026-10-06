namespace UniversityErp.Tests.Architecture;

using Xunit;
using FluentAssertions;
using System.IO;
using System.Xml.Linq;
using System.Linq;
using System.Collections.Generic;

public class NoCrossModuleDomainReferenceTests
{
    private static readonly string RepoRoot = FindRepoRoot();

    [Fact]
    public void Modules_MustNotReferenceOtherModulesDomainOrInfrastructure()
    {
        var modulesDir = Path.Combine(RepoRoot, "University-ERP-Backend", "src", "Modules");
        Directory.Exists(modulesDir).Should().BeTrue();

        var moduleCsprojs = Directory.GetFiles(modulesDir, "*.csproj", SearchOption.AllDirectories)
            .Where(f => !f.Contains("Tests"))
            .ToList();

        moduleCsprojs.Should().NotBeEmpty();

        var violations = new List<string>();

        foreach (var csproj in moduleCsprojs)
        {
            var sourceModule = GetModuleName(csproj);
            var doc = XDocument.Load(csproj);
            var references = doc.Descendants("ProjectReference")
                .Select(pr => pr.Attribute("Include")?.Value)
                .Where(val => !string.IsNullOrEmpty(val))
                .ToList();

            foreach (var reference in references)
            {
                // Normalize reference path
                var normalizedRef = reference!.Replace('\\', '/');
                if (normalizedRef.Contains("/Modules/"))
                {
                    var targetModule = GetModuleName(normalizedRef);
                    if (!string.IsNullOrEmpty(targetModule) && !string.Equals(sourceModule, targetModule, System.StringComparison.OrdinalIgnoreCase))
                    {
                        // Cross module reference! Check layer
                        if (normalizedRef.EndsWith(".Domain.csproj") ||
                            normalizedRef.EndsWith(".Infrastructure.csproj") ||
                            normalizedRef.EndsWith(".Presentation.csproj"))
                        {
                            violations.Add($"Module '{sourceModule}' ({Path.GetFileName(csproj)}) references private layer of '{targetModule}': {reference}");
                        }
                    }
                }
            }
        }

        violations.Should().BeEmpty(
            because: "Rule 1 & ADR-001 forbid direct cross-module references to private Domain, Infrastructure, or Presentation layers.");
    }

    private static string GetModuleName(string path)
    {
        var normalized = path.Replace('\\', '/');
        var parts = normalized.Split('/');
        var idx = System.Array.IndexOf(parts, "Modules");
        if (idx >= 0 && idx + 2 < parts.Length)
        {
            return parts[idx + 2]; // e.g. Modules/Academic/Enrollment -> Enrollment
        }
        return string.Empty;
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

