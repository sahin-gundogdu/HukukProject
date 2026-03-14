using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class GorevYorum : AuditableEntity
{
    public string Icerik { get; set; } = null!;

    // FK'lar
    public int GorevId { get; set; }
    public int KullaniciId { get; set; }

    // Navigation
    public Gorev Gorev { get; set; } = null!;
    public Kullanici Kullanici { get; set; } = null!;
}
