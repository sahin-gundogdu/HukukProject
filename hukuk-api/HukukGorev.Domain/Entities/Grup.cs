using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class Grup : AuditableEntity
{
    public string Ad { get; set; } = null!;
    public string? Aciklama { get; set; }

    // Navigation
    public ICollection<KullaniciGrup> KullaniciGruplari { get; set; } = new List<KullaniciGrup>();
    public ICollection<Gorev> Gorevler { get; set; } = new List<Gorev>();
}
