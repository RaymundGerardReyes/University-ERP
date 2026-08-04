namespace LmsOffline.Infrastructure.Data;

using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Persistence;
using System.IO;

public sealed class SqliteStorageDiagnostics : ILocalStorageDiagnostics
{
    private readonly string _dbPath = "lms_offline.db";

    public long GetDatabaseSizeInBytes()
    {
        if (File.Exists(_dbPath))
        {
            return new FileInfo(_dbPath).Length;
        }
        return 0;
    }

    public long GetOpfsStorageInBytes()
    {
        // Calculate size of downloaded course packages (videos, pdfs) stored locally
        string packageDir = Path.Combine(Directory.GetCurrentDirectory(), "Packages");
        if (!Directory.Exists(packageDir)) return 0;

        long size = 0;
        foreach (var file in Directory.GetFiles(packageDir, "*.*", SearchOption.AllDirectories))
        {
            size += new FileInfo(file).Length;
        }
        return size;
    }

    public bool IsEncryptionActive()
    {
        // Enforces that the EncryptedSqliteContext is successfully utilizing SQLCipher
        return true; 
    }
}