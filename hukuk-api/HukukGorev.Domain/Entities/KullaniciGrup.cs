using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class KullaniciGrup : BaseEntity
{
    public int KullaniciId { get; set; }
    public int GrupId { get; set; }

    // Navigation
    public Kullanici Kullanici { get; set; } = null!;
    public Grup Grup { get; set; } = null!;
}
