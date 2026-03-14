using HukukGorev.Domain.Entities.Common;
using HukukGorev.Domain.Enums;

namespace HukukGorev.Domain.Entities;

public class AltGorev : AuditableEntity
{
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public GorevDurumu Durum { get; set; } = GorevDurumu.YeniAtandi;
    public DateTime? TahminibitisTarihi { get; set; }
    public DateTime? TamamlanmaTarihi { get; set; }

    // FK'lar
    public int GorevId { get; set; }
    public int? AtananKullaniciId { get; set; }

    // Navigation
    public Gorev Gorev { get; set; } = null!;
    public Kullanici? AtananKullanici { get; set; }
    public ICollection<GorevDosya> Dosyalar { get; set; } = new List<GorevDosya>();
    public ICollection<GorevAtamaLog> AtamaLoglari { get; set; } = new List<GorevAtamaLog>();
}
