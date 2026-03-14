using HukukGorev.Domain.Entities.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace HukukGorev.Persistance.Interceptors;

public class EntityInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void UpdateEntities(DbContext? context)
    {
        if (context == null) return;

        foreach (var entry in context.ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Aktif = true;
                    if (entry.Entity is AuditableEntity addedAuditable)
                    {
                        addedAuditable.CreatedAt = DateTime.UtcNow;
                    }
                    break;

                case EntityState.Modified:
                    if (entry.Entity is AuditableEntity modifiedAuditable)
                    {
                        modifiedAuditable.UpdatedAt = DateTime.UtcNow;
                    }
                    break;

                case EntityState.Deleted:
                    // Soft delete
                    entry.State = EntityState.Modified;
                    entry.Entity.Aktif = false;
                    if (entry.Entity is AuditableEntity deletedAuditable)
                    {
                        deletedAuditable.UpdatedAt = DateTime.UtcNow;
                    }
                    break;
            }
        }
    }
}
