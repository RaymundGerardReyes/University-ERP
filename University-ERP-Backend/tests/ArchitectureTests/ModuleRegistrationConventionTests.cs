namespace UniversityErp.Tests.Architecture;

using Xunit;
using FluentAssertions;
using System.IO;
using System.Linq;
using System.Collections.Generic;

public class ModuleRegistrationConventionTests
{
    private static readonly string RepoRoot = FindRepoRoot();

    [Fact]
    public void AllModules_MustContainNonEmptyModuleRegistrationInApplicationLayer()
    {
        var modulesDir = Path.Combine(RepoRoot, "University-ERP-Backend", "src", "Modules");
        Directory.Exists(modulesDir).Should().BeTrue();

        var domainDirs = Directory.GetDirectories(modulesDir);
        var missingOrHollow = new List<string>();

        foreach (var domainDir in domainDirs)
        {
            var moduleDirs = Directory.GetDirectories(domainDir);
            foreach (var moduleDir in moduleDirs)
            {
                var moduleName = Path.GetFileName(moduleDir);
                var appDir = Path.Combine(moduleDir, $"{moduleName}.Application");

                if (!Directory.Exists(appDir)) continue;
                if (!File.Exists(Path.Combine(appDir, $"{moduleName}.Application.csproj"))) continue;

                var registrationFile = Path.Combine(appDir, "ModuleRegistration.cs");
                if (!File.Exists(registrationFile))
                {
                    missingOrHollow.Add($"{moduleName}.Application is missing ModuleRegistration.cs");
                }
                else
                {
                    var fileInfo = new FileInfo(registrationFile);
                    if (fileInfo.Length == 0)
                    {
                        missingOrHollow.Add($"{moduleName}.Application has a 0-byte hollow ModuleRegistration.cs");
                    }
                    else
                    {
                        var content = File.ReadAllText(registrationFile);
                        if (!content.Contains("Add") && !content.Contains("Register"))
                        {
                            missingOrHollow.Add($"{moduleName}.Application ModuleRegistration.cs does not define a registration extension method");
                        }
                    }
                }
            }
        }

        missingOrHollow.Should().BeEmpty(
            because: "All 22 bounded contexts must supply non-hollow ModuleRegistration convention files in their Application layers.");
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

