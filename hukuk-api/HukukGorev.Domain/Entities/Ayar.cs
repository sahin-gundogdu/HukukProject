using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class Ayar : BaseEntity
{
    public string Anahtar { get; set; } = null!;
    public string Deger { get; set; } = null!;
    public string? Aciklama { get; set; }
}
