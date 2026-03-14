using System.Linq.Expressions;
using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Application.Repositories;

public interface IReadRepository<T> where T : BaseEntity
{
    IQueryable<T> GetAll(bool tracking = true);
    IQueryable<T> GetWhere(Expression<Func<T, bool>> method, bool tracking = true);
    Task<T?> GetSingleAsync(Expression<Func<T, bool>> method, bool tracking = true);
    Task<T?> GetByIdAsync(int id, bool tracking = true);
    IQueryable<T> GetAllQueryable();
}
