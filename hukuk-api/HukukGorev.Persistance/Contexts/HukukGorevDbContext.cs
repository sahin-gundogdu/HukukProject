using HukukGorev.Domain.Entities;
using HukukGorev.Domain.Entities.Common;
using HukukGorev.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Persistance.Contexts;

public class HukukGorevDbContext : DbContext
{
    public HukukGorevDbContext(DbContextOptions<HukukGorevDbContext> options) : base(options) { }

    public DbSet<Gorev> GOREVLER { get; set; } = null!;
    public DbSet<AltGorev> ALT_GOREVLER { get; set; } = null!;
    public DbSet<GorevYorum> GOREV_YORUMLARI { get; set; } = null!;
    public DbSet<GorevDosya> GOREV_DOSYALARI { get; set; } = null!;
    public DbSet<GorevAtamaLog> GOREV_ATAMA_LOGLARI { get; set; } = null!;
    public DbSet<Grup> GRUPLAR { get; set; } = null!;
    public DbSet<KullaniciGrup> KULLANICI_GRUPLARI { get; set; } = null!;
    public DbSet<GorevTipi> GOREV_TIPLERI { get; set; } = null!;
    public DbSet<Etiket> ETIKETLER { get; set; } = null!;
    public DbSet<GorevEtiket> GOREV_ETIKETLERI { get; set; } = null!;
    public DbSet<Bildirim> BILDIRIMLER { get; set; } = null!;
    public DbSet<Ayar> AYARLAR { get; set; } = null!;
    public DbSet<Kullanici> KULLANICILAR { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tüm tablo isimleri UPPERCASE
        modelBuilder.Entity<Gorev>().ToTable("GOREVLER");
        modelBuilder.Entity<AltGorev>().ToTable("ALT_GOREVLER");
        modelBuilder.Entity<GorevYorum>().ToTable("GOREV_YORUMLARI");
        modelBuilder.Entity<GorevDosya>().ToTable("GOREV_DOSYALARI");
        modelBuilder.Entity<GorevAtamaLog>().ToTable("GOREV_ATAMA_LOGLARI");
        modelBuilder.Entity<Grup>().ToTable("GRUPLAR");
        modelBuilder.Entity<KullaniciGrup>().ToTable("KULLANICI_GRUPLARI");
        modelBuilder.Entity<GorevTipi>().ToTable("GOREV_TIPLERI");
        modelBuilder.Entity<Etiket>().ToTable("ETIKETLER");
        modelBuilder.Entity<GorevEtiket>().ToTable("GOREV_ETIKETLERI");
        modelBuilder.Entity<Bildirim>().ToTable("BILDIRIMLER");
        modelBuilder.Entity<Ayar>().ToTable("AYARLAR");
        modelBuilder.Entity<Kullanici>().ToTable("KULLANICILAR");

        // Kolon isimleri UPPERCASE
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                property.SetColumnName(property.Name.ToUpperInvariant());
            }
        }

        // ===== Gorev İlişkileri =====
        modelBuilder.Entity<Gorev>(entity =>
        {
            entity.HasOne(g => g.GorevTipi).WithMany(t => t.Gorevler).HasForeignKey(g => g.GorevTipiId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(g => g.AtananKullanici).WithMany(k => k.AtananGorevler).HasForeignKey(g => g.AtananKullaniciId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(g => g.AtananGrup).WithMany(gr => gr.Gorevler).HasForeignKey(g => g.AtananGrupId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(g => g.OlusturanKullanici).WithMany(k => k.OlusturulanGorevler).HasForeignKey(g => g.OlusturanKullaniciId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(g => g.UzerineAlanKullanici).WithMany().HasForeignKey(g => g.UzerineAlanKullaniciId).OnDelete(DeleteBehavior.Restrict);
            entity.Property(g => g.Baslik).HasMaxLength(500).IsRequired();
            entity.Property(g => g.Aciklama).HasMaxLength(5000);
        });

        // ===== AltGorev İlişkileri =====
        modelBuilder.Entity<AltGorev>(entity =>
        {
            entity.HasOne(a => a.Gorev).WithMany(g => g.AltGorevler).HasForeignKey(a => a.GorevId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(a => a.AtananKullanici).WithMany().HasForeignKey(a => a.AtananKullaniciId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(a => a.AtananGrup).WithMany().HasForeignKey(a => a.AtananGrupId).OnDelete(DeleteBehavior.Restrict);
            entity.Property(a => a.Baslik).HasMaxLength(500).IsRequired();
        });

        // ===== GorevYorum İlişkileri =====
        modelBuilder.Entity<GorevYorum>(entity =>
        {
            entity.HasOne(y => y.Gorev).WithMany(g => g.Yorumlar).HasForeignKey(y => y.GorevId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(y => y.Kullanici).WithMany(k => k.Yorumlar).HasForeignKey(y => y.KullaniciId).OnDelete(DeleteBehavior.Restrict);
            entity.Property(y => y.Icerik).HasMaxLength(5000).IsRequired();
        });

        // ===== GorevDosya İlişkileri =====
        modelBuilder.Entity<GorevDosya>(entity =>
        {
            entity.HasOne(d => d.Gorev).WithMany(g => g.Dosyalar).HasForeignKey(d => d.GorevId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(d => d.AltGorev).WithMany(a => a.Dosyalar).HasForeignKey(d => d.AltGorevId).OnDelete(DeleteBehavior.Restrict);
            entity.Property(d => d.DosyaAdi).HasMaxLength(500).IsRequired();
            entity.Property(d => d.DosyaTipi).HasMaxLength(100).IsRequired();
        });

        // ===== GorevAtamaLog İlişkileri =====
        modelBuilder.Entity<GorevAtamaLog>(entity =>
        {
            entity.HasOne(al => al.Gorev).WithMany(g => g.AtamaLoglari).HasForeignKey(al => al.GorevId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(al => al.AltGorev).WithMany(a => a.AtamaLoglari).HasForeignKey(al => al.AltGorevId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(al => al.AtananKullanici).WithMany().HasForeignKey(al => al.AtananKullaniciId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(al => al.AtananGrup).WithMany().HasForeignKey(al => al.AtananGrupId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(al => al.AtayanKullanici).WithMany(k => k.AtamaLoglari).HasForeignKey(al => al.AtayanKullaniciId).OnDelete(DeleteBehavior.Restrict);
        });

        // ===== KullaniciGrup İlişkileri =====
        modelBuilder.Entity<KullaniciGrup>(entity =>
        {
            entity.HasOne(kg => kg.Kullanici).WithMany(k => k.KullaniciGruplari).HasForeignKey(kg => kg.KullaniciId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(kg => kg.Grup).WithMany(g => g.KullaniciGruplari).HasForeignKey(kg => kg.GrupId).OnDelete(DeleteBehavior.Cascade);
        });

        // ===== GorevEtiket İlişkileri =====
        modelBuilder.Entity<GorevEtiket>(entity =>
        {
            entity.HasOne(ge => ge.Gorev).WithMany(g => g.GorevEtiketler).HasForeignKey(ge => ge.GorevId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ge => ge.Etiket).WithMany(e => e.GorevEtiketler).HasForeignKey(ge => ge.EtiketId).OnDelete(DeleteBehavior.Cascade);
        });

        // ===== Bildirim İlişkileri =====
        modelBuilder.Entity<Bildirim>(entity =>
        {
            entity.HasOne(b => b.Kullanici).WithMany(k => k.Bildirimler).HasForeignKey(b => b.KullaniciId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(b => b.Gorev).WithMany().HasForeignKey(b => b.GorevId).OnDelete(DeleteBehavior.SetNull);
            entity.Property(b => b.Baslik).HasMaxLength(500).IsRequired();
            entity.Property(b => b.Mesaj).HasMaxLength(2000).IsRequired();
        });

        // ===== Kullanici =====
        modelBuilder.Entity<Kullanici>(entity =>
        {
            entity.Property(k => k.Ad).HasMaxLength(100).IsRequired();
            entity.Property(k => k.Soyad).HasMaxLength(100).IsRequired();
            entity.Property(k => k.Email).HasMaxLength(200).IsRequired();
            entity.HasIndex(k => k.Email).IsUnique();

            // Hierarchy configuration
            entity.HasOne(k => k.Yonetici)
                  .WithMany(k => k.AltCalisanlar)
                  .HasForeignKey(k => k.YoneticiId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== Grup =====
        modelBuilder.Entity<Grup>(entity =>
        {
            entity.Property(g => g.Ad).HasMaxLength(200).IsRequired();
        });

        // ===== GorevTipi =====
        modelBuilder.Entity<GorevTipi>(entity =>
        {
            entity.Property(t => t.Ad).HasMaxLength(200).IsRequired();
        });

        // ===== Etiket =====
        modelBuilder.Entity<Etiket>(entity =>
        {
            entity.Property(e => e.Ad).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Renk).HasMaxLength(20);
        });

        // ===== Ayar =====
        modelBuilder.Entity<Ayar>(entity =>
        {
            entity.Property(a => a.Anahtar).HasMaxLength(200).IsRequired();
            entity.HasIndex(a => a.Anahtar).IsUnique();
            entity.Property(a => a.Deger).HasMaxLength(500).IsRequired();
        });

        // Seed data - varsayılan gruplar ve ayarlar
        modelBuilder.Entity<Grup>().HasData(
            new Grup { Id = 1, Ad = "Uyum", Aciklama = "Uyum Grubu", CreatedAt = new DateTime(2026, 1, 1) },
            new Grup { Id = 2, Ad = "KVKK", Aciklama = "KVKK Grubu", CreatedAt = new DateTime(2026, 1, 1) }
        );

        modelBuilder.Entity<Ayar>().HasData(
            new Ayar { Id = 1, Anahtar = "MaxDosyaBoyutuMB", Deger = "25", Aciklama = "Maksimum dosya boyutu (MB)" },
            new Ayar { Id = 2, Anahtar = "HatirlatmaOrtasiGun", Deger = "0.5", Aciklama = "Görev süresinin ortasında hatırlatma (oran)" },
            new Ayar { Id = 3, Anahtar = "HatirlatmaBitimGun", Deger = "1", Aciklama = "Bitiş tarihinden kaç gün önce hatırlatma" },
            new Ayar { Id = 4, Anahtar = "SmtpHost", Deger = "smtp.example.com", Aciklama = "SMTP sunucu adresi" },
            new Ayar { Id = 5, Anahtar = "SmtpPort", Deger = "587", Aciklama = "SMTP port numarası" },
            new Ayar { Id = 6, Anahtar = "SmtpKullaniciAdi", Deger = "", Aciklama = "SMTP kullanıcı adı" },
            new Ayar { Id = 7, Anahtar = "SmtpSifre", Deger = "", Aciklama = "SMTP şifre" }
        );

        modelBuilder.Entity<GorevTipi>().HasData(
            new GorevTipi { Id = 1, Ad = "Proje", Aciklama = "Proje görevi", CreatedAt = new DateTime(2026, 1, 1) },
            new GorevTipi { Id = 2, Ad = "Sözleşme", Aciklama = "Sözleşme görevi", CreatedAt = new DateTime(2026, 1, 1) },
            new GorevTipi { Id = 3, Ad = "KVKK", Aciklama = "KVKK görevi", CreatedAt = new DateTime(2026, 1, 1) },
            new GorevTipi { Id = 4, Ad = "Danışmanlık", Aciklama = "Danışmanlık görevi", CreatedAt = new DateTime(2026, 1, 1) },
            new GorevTipi { Id = 5, Ad = "Personel", Aciklama = "Personel görevi", CreatedAt = new DateTime(2026, 1, 1) }
        );

        // ===== Varsayılan Administrator Kullanıcısı =====
        // Şifre: 1  (SHA256 → Base64)
        var adminSifreHash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes("1")));

        modelBuilder.Entity<Kullanici>().HasData(
            new Kullanici
            {
                Id = 99,
                Ad = "Administrator",
                Soyad = "Admin",
                Email = "admin@hukuk.com",
                SifreHash = adminSifreHash,
                Rol = KullaniciRolu.Admin,
                Aktif = true,
                CreatedAt = new DateTime(2026, 1, 1)
            }
        );
    }
}
