using HukukGorev.Application.Repositories.AltGorev;
using HukukGorev.Application.Repositories.Ayar;
using HukukGorev.Application.Repositories.Bildirim;
using HukukGorev.Application.Repositories.Etiket;
using HukukGorev.Application.Repositories.Gorev;
using HukukGorev.Application.Repositories.GorevAtamaLog;
using HukukGorev.Application.Repositories.GorevDosya;
using HukukGorev.Application.Repositories.GorevEtiket;
using HukukGorev.Application.Repositories.GorevTipi;
using HukukGorev.Application.Repositories.GorevYorum;
using HukukGorev.Application.Repositories.Grup;
using HukukGorev.Application.Repositories.Kullanici;
using HukukGorev.Application.Repositories.KullaniciGrup;
using HukukGorev.Domain.Entities;
using HukukGorev.Persistance.Contexts;

namespace HukukGorev.Persistance.Repositories;

// Gorev
public class GorevReadRepository : ReadRepository<Gorev>, IGorevReadRepository { public GorevReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GorevWriteRepository : WriteRepository<Gorev>, IGorevWriteRepository { public GorevWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// AltGorev
public class AltGorevReadRepository : ReadRepository<AltGorev>, IAltGorevReadRepository { public AltGorevReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class AltGorevWriteRepository : WriteRepository<AltGorev>, IAltGorevWriteRepository { public AltGorevWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// GorevYorum
public class GorevYorumReadRepository : ReadRepository<GorevYorum>, IGorevYorumReadRepository { public GorevYorumReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GorevYorumWriteRepository : WriteRepository<GorevYorum>, IGorevYorumWriteRepository { public GorevYorumWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// GorevDosya
public class GorevDosyaReadRepository : ReadRepository<GorevDosya>, IGorevDosyaReadRepository { public GorevDosyaReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GorevDosyaWriteRepository : WriteRepository<GorevDosya>, IGorevDosyaWriteRepository { public GorevDosyaWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// GorevAtamaLog
public class GorevAtamaLogReadRepository : ReadRepository<GorevAtamaLog>, IGorevAtamaLogReadRepository { public GorevAtamaLogReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GorevAtamaLogWriteRepository : WriteRepository<GorevAtamaLog>, IGorevAtamaLogWriteRepository { public GorevAtamaLogWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// Grup
public class GrupReadRepository : ReadRepository<Grup>, IGrupReadRepository { public GrupReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GrupWriteRepository : WriteRepository<Grup>, IGrupWriteRepository { public GrupWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// KullaniciGrup
public class KullaniciGrupReadRepository : ReadRepository<KullaniciGrup>, IKullaniciGrupReadRepository { public KullaniciGrupReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class KullaniciGrupWriteRepository : WriteRepository<KullaniciGrup>, IKullaniciGrupWriteRepository { public KullaniciGrupWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// GorevTipi
public class GorevTipiReadRepository : ReadRepository<GorevTipi>, IGorevTipiReadRepository { public GorevTipiReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GorevTipiWriteRepository : WriteRepository<GorevTipi>, IGorevTipiWriteRepository { public GorevTipiWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// Etiket
public class EtiketReadRepository : ReadRepository<Etiket>, IEtiketReadRepository { public EtiketReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class EtiketWriteRepository : WriteRepository<Etiket>, IEtiketWriteRepository { public EtiketWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// GorevEtiket
public class GorevEtiketReadRepository : ReadRepository<GorevEtiket>, IGorevEtiketReadRepository { public GorevEtiketReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class GorevEtiketWriteRepository : WriteRepository<GorevEtiket>, IGorevEtiketWriteRepository { public GorevEtiketWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// Bildirim
public class BildirimReadRepository : ReadRepository<Bildirim>, IBildirimReadRepository { public BildirimReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class BildirimWriteRepository : WriteRepository<Bildirim>, IBildirimWriteRepository { public BildirimWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// Ayar
public class AyarReadRepository : ReadRepository<Ayar>, IAyarReadRepository { public AyarReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class AyarWriteRepository : WriteRepository<Ayar>, IAyarWriteRepository { public AyarWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }

// Kullanici
public class KullaniciReadRepository : ReadRepository<Kullanici>, IKullaniciReadRepository { public KullaniciReadRepository(HukukGorevDbContext ctx) : base(ctx) { } }
public class KullaniciWriteRepository : WriteRepository<Kullanici>, IKullaniciWriteRepository { public KullaniciWriteRepository(HukukGorevDbContext ctx) : base(ctx) { } }
