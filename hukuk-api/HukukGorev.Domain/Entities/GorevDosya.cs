using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class GorevDosya : AuditableEntity
{
    public string DosyaAdi { get; set; } = null!;
    public string DosyaTipi { get; set; } = null!;
    public long DosyaBoyutu { get; set; }
    public byte[] DosyaIcerigi { get; set; } = null!;

    // FK'lar - görev veya alt göreve bağlı olabilir
    public int? GorevId { get; set; }
    public int? AltGorevId { get; set; }

    // Navigation
    public Gorev? Gorev { get; set; }
    public AltGorev? AltGorev { get; set; }
}
