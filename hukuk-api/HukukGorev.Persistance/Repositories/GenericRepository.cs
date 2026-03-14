using System.Linq.Expressions;
using HukukGorev.Application.Repositories;
using HukukGorev.Domain.Entities.Common;
using HukukGorev.Persistance.Contexts;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Persistance.Repositories;

public class ReadRepository<T> : IReadRepository<T> where T : BaseEntity
{
    protected readonly HukukGorevDbContext _context;

    public ReadRepository(HukukGorevDbContext context) => _context = context;

    public DbSet<T> Table => _context.Set<T>();

    public IQueryable<T> GetAll(bool tracking = true)
    {
        var query = Table.AsQueryable();
        if (!tracking) query = query.AsNoTracking();
        return query;
    }

    public IQueryable<T> GetWhere(Expression<Func<T, bool>> method, bool tracking = true)
    {
        var query = Table.Where(method);
        if (!tracking) query = query.AsNoTracking();
        return query;
    }

    public async Task<T?> GetSingleAsync(Expression<Func<T, bool>> method, bool tracking = true)
    {
        var query = Table.AsQueryable();
        if (!tracking) query = query.AsNoTracking();
        return await query.FirstOrDefaultAsync(method);
    }

    public async Task<T?> GetByIdAsync(int id, bool tracking = true)
    {
        var query = Table.AsQueryable();
        if (!tracking) query = query.AsNoTracking();
        return await query.FirstOrDefaultAsync(e => e.Id == id);
    }

    public IQueryable<T> GetAllQueryable() => Table.AsQueryable();
}

public class WriteRepository<T> : IWriteRepository<T> where T : BaseEntity
{
    protected readonly HukukGorevDbContext _context;

    public WriteRepository(HukukGorevDbContext context) => _context = context;

    public DbSet<T> Table => _context.Set<T>();

    public async Task<bool> AddAsync(T model)
    {
        var entry = await Table.AddAsync(model);
        return entry.State == EntityState.Added;
    }

    public bool Update(T model)
    {
        var entry = Table.Update(model);
        return entry.State == EntityState.Modified;
    }

    public bool Remove(T model)
    {
        var entry = Table.Remove(model);
        return entry.State == EntityState.Deleted;
    }

    public bool RemoveRange(IEnumerable<T> models)
    {
        Table.RemoveRange(models);
        return true;
    }

    public async Task<int> SaveAsync() => await _context.SaveChangesAsync();
}
