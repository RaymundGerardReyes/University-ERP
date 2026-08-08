using Avalonia;
using System;

namespace LmsOffline.Presentation;

class Program
{
    // Initialization code. Don't use any Avalonia, third-party APIs or any
    // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
    // yet and stuff might break.
    [STAThread]
    public static void Main(string[] args)
    {
        try
        {
            AppDomain.CurrentDomain.UnhandledException += (s, e) =>
            {
                System.IO.File.WriteAllText("crash.log", $"UnhandledException: {e.ExceptionObject}");
            };

            System.Threading.Tasks.TaskScheduler.UnobservedTaskException += (s, e) =>
            {
                System.IO.File.AppendAllText("crash.log", $"\nUnobservedTaskException: {e.Exception}");
            };

            BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);
        }
        catch (Exception ex)
        {
            System.IO.File.WriteAllText("crash.log", $"Fatal Main Exception: {ex}");
            throw;
        }
    }

    // Avalonia configuration, don't remove; also used by visual designer.
    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>()
            .UsePlatformDetect()
            .WithInterFont()
            .LogToTrace();
}
