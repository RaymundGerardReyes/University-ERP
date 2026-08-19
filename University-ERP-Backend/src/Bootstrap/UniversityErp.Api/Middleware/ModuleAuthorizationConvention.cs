namespace UniversityErp.Api.Middleware;

using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Authorization;

public class ModuleAuthorizationConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        var ns = controller.ControllerType.Namespace ?? "";

        // Determine Policy based on Bounded Context / Module Namespace
        if (ns.Contains(".Finance"))
        {
            controller.Filters.Add(new AuthorizeFilter("Portal.Finance.Access"));
        }
        else if (ns.Contains(".Admissions"))
        {
            controller.Filters.Add(new AuthorizeFilter("Portal.Admission.Access"));
        }
        else if (ns.Contains(".StudentInformation") || ns.Contains(".Enrollment"))
        {
            controller.Filters.Add(new AuthorizeFilter("Portal.Student.Access"));
        }
        else if (ns.Contains("Academic.") || ns.Contains(".Faculty"))
        {
            controller.Filters.Add(new AuthorizeFilter("Portal.Faculty.Access"));
        }
        else if (ns.Contains(".Registrar"))
        {
            controller.Filters.Add(new AuthorizeFilter("Portal.Registrar.Access"));
        }
        else if (ns.Contains("Administration.")) // Default for remaining administration modules
        {
            controller.Filters.Add(new AuthorizeFilter("Portal.Admin.Access"));
        }
        // IdentityAccess is already explicitly allowed anonymous on LoginEndpoint
        // All other modules not explicitly listed will fall back to the global RequireAuthenticatedUser
        // fallback policy defined in Program.cs.
    }
}
