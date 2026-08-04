namespace LmsOffline.Application.Interfaces;

public interface ILocalStorageDiagnostics
{
    long GetDatabaseSizeInBytes();
    long GetOpfsStorageInBytes();
    bool IsEncryptionActive();
}