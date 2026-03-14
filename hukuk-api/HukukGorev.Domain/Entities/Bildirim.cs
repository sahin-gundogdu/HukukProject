using HukukGorev.Domain.Entities.Common;
using HukukGorev.Domain.Enums;

namespace HukukGorev.Domain.Entities;

public class Bildirim : AuditableEntity
{
    public string Baslik { get; set; } = null!;
    public string Mesaj { get; set; } = null!;
    public BildirimTipi Tip { get; set; }
    public bool Okundu { get; set; } = false;
    public int? GorevId { get; set; }

    // FK'lar
    public int KullaniciId { get; set; }

    // Navigation
    public Kullanici Kullanici { get; set; } = null!;
    public Gorev? Gorev { get; set; }
}
