using HukukGorev.Domain.Entities.Common;
using HukukGorev.Domain.Enums;

namespace HukukGorev.Domain.Entities;

public class GorevAtamaLog : BaseEntity
{
    public DateTime AtamaTarihi { get; set; }
    public string? Aciklama { get; set; }
    public AtamaTipi AtamaTipi { get; set; }

    // FK'lar
    public int? GorevId { get; set; }
    public int? AltGorevId { get; set; }
    public int? AtananKullaniciId { get; set; }
    public int? AtananGrupId { get; set; }
    public int AtayanKullaniciId { get; set; }

    // Navigation
    public Gorev? Gorev { get; set; }
    public AltGorev? AltGorev { get; set; }
    public Kullanici? AtananKullanici { get; set; }
    public Grup? AtananGrup { get; set; }
    public Kullanici AtayanKullanici { get; set; } = null!;
}
