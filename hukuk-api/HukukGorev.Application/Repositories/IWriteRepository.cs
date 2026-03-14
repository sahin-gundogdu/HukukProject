using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Application.Repositories;

public interface IWriteRepository<T> where T : BaseEntity
{
    Task<bool> AddAsync(T model);
    bool Update(T model);
    bool Remove(T model);
    bool RemoveRange(IEnumerable<T> models);
    Task<int> SaveAsync();
}
