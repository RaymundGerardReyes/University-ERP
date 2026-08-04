namespace UniversityErp.Worker;

public class Worker(ILogger<Worker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("University ERP Background Worker is running. Awaiting job registrations...");
        }

        // Suspend the background service indefinitely without consuming CPU
        // while it waits for shutdown. Future scheduled jobs (e.g., Quartz.NET) 
        // or message consumers (e.g., MassTransit) will be registered alongside this.
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}
