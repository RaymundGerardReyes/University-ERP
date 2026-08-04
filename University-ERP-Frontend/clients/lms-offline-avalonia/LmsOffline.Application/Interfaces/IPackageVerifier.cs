namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;

public interface IPackageVerifier
{
    Task<bool> VerifySignatureAsync(string filePath, string expectedSignature, CancellationToken cancellationToken = default);
}