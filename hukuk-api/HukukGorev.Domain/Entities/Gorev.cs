using HukukGorev.Domain.Entities.Common;
using HukukGorev.Domain.Enums;

namespace HukukGorev.Domain.Entities;

public class Gorev : AuditableEntity
{
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public OncelikSeviyesi Oncelik { get; set; } = OncelikSeviyesi.Orta;
    public GorevDurumu Durum { get; set; } = GorevDurumu.YeniAtandi;
    public AtamaTipi AtamaTipi { get; set; } = AtamaTipi.Kisi;
    public DateTime? BitisTarihi { get; set; }
    public DateTime? TamamlanmaTarihi { get; set; }
    public bool HatirlatmaGonderildiOrtasi { get; set; } = false;
    public bool HatirlatmaGonderildiBitimi { get; set; } = false;

    // FK'lar
    public int? GorevTipiId { get; set; }
    public int? AtananKullaniciId { get; set; }
    public int? AtananGrupId { get; set; }
    public int OlusturanKullaniciId { get; set; }
    public int? UzerineAlanKullaniciId { get; set; }

    // Navigation
    public GorevTipi? GorevTipi { get; set; }
    public Kullanici? AtananKullanici { get; set; }
    public Grup? AtananGrup { get; set; }
    public Kullanici OlusturanKullanici { get; set; } = null!;
    public Kullanici? UzerineAlanKullanici { get; set; }
    public ICollection<AltGorev> AltGorevler { get; set; } = new List<AltGorev>();
    public ICollection<GorevYorum> Yorumlar { get; set; } = new List<GorevYorum>();
    public ICollection<GorevDosya> Dosyalar { get; set; } = new List<GorevDosya>();
    public ICollection<GorevEtiket> GorevEtiketler { get; set; } = new List<GorevEtiket>();
    public ICollection<GorevAtamaLog> AtamaLoglari { get; set; } = new List<GorevAtamaLog>();
}
