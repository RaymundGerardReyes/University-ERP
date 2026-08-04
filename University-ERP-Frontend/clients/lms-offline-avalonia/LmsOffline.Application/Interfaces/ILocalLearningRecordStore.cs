namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface ILocalLearningRecordStore
{
    Task SaveEventAsync(LearningEvent learningEvent, CancellationToken cancellationToken = default);
}