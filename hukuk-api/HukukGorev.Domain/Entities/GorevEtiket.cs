using HukukGorev.Domain.Entities.Common;

namespace HukukGorev.Domain.Entities;

public class GorevEtiket : BaseEntity
{
    public int GorevId { get; set; }
    public int EtiketId { get; set; }

    // Navigation
    public Gorev Gorev { get; set; } = null!;
    public Etiket Etiket { get; set; } = null!;
}
