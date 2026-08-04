namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;

public interface IPackageSecurityService
{
    /// <summary>
    /// Verifies the cryptographic integrity of a downloaded course package.
    /// </summary>
    Task<bool> VerifySignatureAsync(string packageFilePath, string expectedSignature, CancellationToken cancellationToken = default);
}