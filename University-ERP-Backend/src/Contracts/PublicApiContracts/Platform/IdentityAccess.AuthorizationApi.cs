namespace Contracts.PublicApiContracts.Platform;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Open Host Service contract exposed by IdentityAccess.
/// Used synchronously by API Gateways and microservices to validate permissions.
/// </summary>
public interface IIdentityAccessAuthorizationApi
{
    Task<bool> HasPermissionAsync(Guid userId, string permissionCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);
}
