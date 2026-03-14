using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class GorevTipi : AuditableEntity
{
    public string Ad { get; set; } = null!;
    public string? Aciklama { get; set; }

    // Navigation
    public ICollection<Gorev> Gorevler { get; set; } = new List<Gorev>();
}
