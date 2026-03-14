using HukukGorev.Domain.Entities.Common;
using HukukGorev.Domain.Enums;

namespace HukukGorev.Domain.Entities;

public class Kullanici : AuditableEntity
{
    public string Ad { get; set; } = null!;
    public string Soyad { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string SifreHash { get; set; } = null!;
    public KullaniciRolu Rol { get; set; } = KullaniciRolu.Kullanici;
    public int? YoneticiId { get; set; }

    // Navigation
    public Kullanici? Yonetici { get; set; }
    public ICollection<Kullanici> AltCalisanlar { get; set; } = new List<Kullanici>();
    public ICollection<KullaniciGrup> KullaniciGruplari { get; set; } = new List<KullaniciGrup>();
    public ICollection<Gorev> OlusturulanGorevler { get; set; } = new List<Gorev>();
    public ICollection<Gorev> AtananGorevler { get; set; } = new List<Gorev>();
    public ICollection<GorevYorum> Yorumlar { get; set; } = new List<GorevYorum>();
    public ICollection<Bildirim> Bildirimler { get; set; } = new List<Bildirim>();
    public ICollection<GorevAtamaLog> AtamaLoglari { get; set; } = new List<GorevAtamaLog>();
}
