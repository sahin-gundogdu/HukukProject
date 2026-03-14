using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class Etiket : AuditableEntity
{
    public string Ad { get; set; } = null!;
    public string? Renk { get; set; }

    // Navigation
    public ICollection<GorevEtiket> GorevEtiketler { get; set; } = new List<GorevEtiket>();
}
