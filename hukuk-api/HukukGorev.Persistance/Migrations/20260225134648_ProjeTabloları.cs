using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HukukGorev.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class ProjeTabloları : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AYARLAR",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ANAHTAR = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DEGER = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ACIKLAMA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AYARLAR", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ETIKETLER",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AD = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RENK = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETIKETLER", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "GOREV_TIPLERI",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AD = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ACIKLAMA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GOREV_TIPLERI", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "GRUPLAR",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AD = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ACIKLAMA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GRUPLAR", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "KULLANICILAR",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AD = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SOYAD = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EMAIL = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SIFREHASH = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ROL = table.Column<int>(type: "int", nullable: false),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KULLANICILAR", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "GOREVLER",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BASLIK = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ACIKLAMA = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: true),
                    ONCELIK = table.Column<int>(type: "int", nullable: false),
                    DURUM = table.Column<int>(type: "int", nullable: false),
                    ATAMATIPI = table.Column<int>(type: "int", nullable: false),
                    BITISTARIHI = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TAMAMLANMATARIHI = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HATIRLATMAGONDERILDIORTASI = table.Column<bool>(type: "bit", nullable: false),
                    HATIRLATMAGONDERILDIBITIMI = table.Column<bool>(type: "bit", nullable: false),
                    GOREVTIPIID = table.Column<int>(type: "int", nullable: true),
                    ATANANKULLANICIID = table.Column<int>(type: "int", nullable: true),
                    ATANANGRUPID = table.Column<int>(type: "int", nullable: true),
                    OLUSTURANKULLANICIID = table.Column<int>(type: "int", nullable: false),
                    UZERINEALANKULLANICIID = table.Column<int>(type: "int", nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GOREVLER", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GOREVLER_GOREV_TIPLERI_GOREVTIPIID",
                        column: x => x.GOREVTIPIID,
                        principalTable: "GOREV_TIPLERI",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_GOREVLER_GRUPLAR_ATANANGRUPID",
                        column: x => x.ATANANGRUPID,
                        principalTable: "GRUPLAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREVLER_KULLANICILAR_ATANANKULLANICIID",
                        column: x => x.ATANANKULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREVLER_KULLANICILAR_OLUSTURANKULLANICIID",
                        column: x => x.OLUSTURANKULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREVLER_KULLANICILAR_UZERINEALANKULLANICIID",
                        column: x => x.UZERINEALANKULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KULLANICI_GRUPLARI",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KULLANICIID = table.Column<int>(type: "int", nullable: false),
                    GRUPID = table.Column<int>(type: "int", nullable: false),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KULLANICI_GRUPLARI", x => x.ID);
                    table.ForeignKey(
                        name: "FK_KULLANICI_GRUPLARI_GRUPLAR_GRUPID",
                        column: x => x.GRUPID,
                        principalTable: "GRUPLAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KULLANICI_GRUPLARI_KULLANICILAR_KULLANICIID",
                        column: x => x.KULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ALT_GOREVLER",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BASLIK = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ACIKLAMA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DURUM = table.Column<int>(type: "int", nullable: false),
                    TAHMINIBITISTARIHI = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TAMAMLANMATARIHI = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GOREVID = table.Column<int>(type: "int", nullable: false),
                    ATANANKULLANICIID = table.Column<int>(type: "int", nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ALT_GOREVLER", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ALT_GOREVLER_GOREVLER_GOREVID",
                        column: x => x.GOREVID,
                        principalTable: "GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ALT_GOREVLER_KULLANICILAR_ATANANKULLANICIID",
                        column: x => x.ATANANKULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BILDIRIMLER",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BASLIK = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    MESAJ = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    TIP = table.Column<int>(type: "int", nullable: false),
                    OKUNDU = table.Column<bool>(type: "bit", nullable: false),
                    GOREVID = table.Column<int>(type: "int", nullable: true),
                    KULLANICIID = table.Column<int>(type: "int", nullable: false),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BILDIRIMLER", x => x.ID);
                    table.ForeignKey(
                        name: "FK_BILDIRIMLER_GOREVLER_GOREVID",
                        column: x => x.GOREVID,
                        principalTable: "GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_BILDIRIMLER_KULLANICILAR_KULLANICIID",
                        column: x => x.KULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GOREV_ETIKETLERI",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GOREVID = table.Column<int>(type: "int", nullable: false),
                    ETIKETID = table.Column<int>(type: "int", nullable: false),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GOREV_ETIKETLERI", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GOREV_ETIKETLERI_ETIKETLER_ETIKETID",
                        column: x => x.ETIKETID,
                        principalTable: "ETIKETLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GOREV_ETIKETLERI_GOREVLER_GOREVID",
                        column: x => x.GOREVID,
                        principalTable: "GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GOREV_YORUMLARI",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ICERIK = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: false),
                    GOREVID = table.Column<int>(type: "int", nullable: false),
                    KULLANICIID = table.Column<int>(type: "int", nullable: false),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GOREV_YORUMLARI", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GOREV_YORUMLARI_GOREVLER_GOREVID",
                        column: x => x.GOREVID,
                        principalTable: "GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GOREV_YORUMLARI_KULLANICILAR_KULLANICIID",
                        column: x => x.KULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GOREV_ATAMA_LOGLARI",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ATAMATARIHI = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ACIKLAMA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ATAMATIPI = table.Column<int>(type: "int", nullable: false),
                    GOREVID = table.Column<int>(type: "int", nullable: true),
                    ALTGOREVID = table.Column<int>(type: "int", nullable: true),
                    ATANANKULLANICIID = table.Column<int>(type: "int", nullable: true),
                    ATANANGRUPID = table.Column<int>(type: "int", nullable: true),
                    ATAYANKULLANICIID = table.Column<int>(type: "int", nullable: false),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GOREV_ATAMA_LOGLARI", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GOREV_ATAMA_LOGLARI_ALT_GOREVLER_ALTGOREVID",
                        column: x => x.ALTGOREVID,
                        principalTable: "ALT_GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREV_ATAMA_LOGLARI_GOREVLER_GOREVID",
                        column: x => x.GOREVID,
                        principalTable: "GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GOREV_ATAMA_LOGLARI_GRUPLAR_ATANANGRUPID",
                        column: x => x.ATANANGRUPID,
                        principalTable: "GRUPLAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREV_ATAMA_LOGLARI_KULLANICILAR_ATANANKULLANICIID",
                        column: x => x.ATANANKULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREV_ATAMA_LOGLARI_KULLANICILAR_ATAYANKULLANICIID",
                        column: x => x.ATAYANKULLANICIID,
                        principalTable: "KULLANICILAR",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GOREV_DOSYALARI",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DOSYAADI = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DOSYATIPI = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DOSYABOYUTU = table.Column<long>(type: "bigint", nullable: false),
                    DOSYAICERIGI = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    GOREVID = table.Column<int>(type: "int", nullable: true),
                    ALTGOREVID = table.Column<int>(type: "int", nullable: true),
                    AKTIF = table.Column<bool>(type: "bit", nullable: false),
                    CREATEDAT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UPDATEDAT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDBY = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GOREV_DOSYALARI", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GOREV_DOSYALARI_ALT_GOREVLER_ALTGOREVID",
                        column: x => x.ALTGOREVID,
                        principalTable: "ALT_GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GOREV_DOSYALARI_GOREVLER_GOREVID",
                        column: x => x.GOREVID,
                        principalTable: "GOREVLER",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AYARLAR",
                columns: new[] { "ID", "ACIKLAMA", "AKTIF", "ANAHTAR", "DEGER" },
                values: new object[,]
                {
                    { 1, "Maksimum dosya boyutu (MB)", true, "MaxDosyaBoyutuMB", "25" },
                    { 2, "Görev süresinin ortasında hatırlatma (oran)", true, "HatirlatmaOrtasiGun", "0.5" },
                    { 3, "Bitiş tarihinden kaç gün önce hatırlatma", true, "HatirlatmaBitimGun", "1" },
                    { 4, "SMTP sunucu adresi", true, "SmtpHost", "smtp.example.com" },
                    { 5, "SMTP port numarası", true, "SmtpPort", "587" },
                    { 6, "SMTP kullanıcı adı", true, "SmtpKullaniciAdi", "" },
                    { 7, "SMTP şifre", true, "SmtpSifre", "" }
                });

            migrationBuilder.InsertData(
                table: "GOREV_TIPLERI",
                columns: new[] { "ID", "ACIKLAMA", "AD", "AKTIF", "CREATEDAT", "CREATEDBY", "UPDATEDAT", "UPDATEDBY" },
                values: new object[,]
                {
                    { 1, "Proje görevi", "Proje", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null },
                    { 2, "Sözleşme görevi", "Sözleşme", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null },
                    { 3, "KVKK görevi", "KVKK", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null },
                    { 4, "Danışmanlık görevi", "Danışmanlık", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null },
                    { 5, "Personel görevi", "Personel", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null }
                });

            migrationBuilder.InsertData(
                table: "GRUPLAR",
                columns: new[] { "ID", "ACIKLAMA", "AD", "AKTIF", "CREATEDAT", "CREATEDBY", "UPDATEDAT", "UPDATEDBY" },
                values: new object[,]
                {
                    { 1, "Uyum Grubu", "Uyum", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null },
                    { 2, "KVKK Grubu", "KVKK", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ALT_GOREVLER_ATANANKULLANICIID",
                table: "ALT_GOREVLER",
                column: "ATANANKULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_ALT_GOREVLER_GOREVID",
                table: "ALT_GOREVLER",
                column: "GOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_AYARLAR_ANAHTAR",
                table: "AYARLAR",
                column: "ANAHTAR",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BILDIRIMLER_GOREVID",
                table: "BILDIRIMLER",
                column: "GOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_BILDIRIMLER_KULLANICIID",
                table: "BILDIRIMLER",
                column: "KULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ATAMA_LOGLARI_ALTGOREVID",
                table: "GOREV_ATAMA_LOGLARI",
                column: "ALTGOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ATAMA_LOGLARI_ATANANGRUPID",
                table: "GOREV_ATAMA_LOGLARI",
                column: "ATANANGRUPID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ATAMA_LOGLARI_ATANANKULLANICIID",
                table: "GOREV_ATAMA_LOGLARI",
                column: "ATANANKULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ATAMA_LOGLARI_ATAYANKULLANICIID",
                table: "GOREV_ATAMA_LOGLARI",
                column: "ATAYANKULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ATAMA_LOGLARI_GOREVID",
                table: "GOREV_ATAMA_LOGLARI",
                column: "GOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_DOSYALARI_ALTGOREVID",
                table: "GOREV_DOSYALARI",
                column: "ALTGOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_DOSYALARI_GOREVID",
                table: "GOREV_DOSYALARI",
                column: "GOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ETIKETLERI_ETIKETID",
                table: "GOREV_ETIKETLERI",
                column: "ETIKETID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_ETIKETLERI_GOREVID",
                table: "GOREV_ETIKETLERI",
                column: "GOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_YORUMLARI_GOREVID",
                table: "GOREV_YORUMLARI",
                column: "GOREVID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREV_YORUMLARI_KULLANICIID",
                table: "GOREV_YORUMLARI",
                column: "KULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREVLER_ATANANGRUPID",
                table: "GOREVLER",
                column: "ATANANGRUPID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREVLER_ATANANKULLANICIID",
                table: "GOREVLER",
                column: "ATANANKULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREVLER_GOREVTIPIID",
                table: "GOREVLER",
                column: "GOREVTIPIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREVLER_OLUSTURANKULLANICIID",
                table: "GOREVLER",
                column: "OLUSTURANKULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_GOREVLER_UZERINEALANKULLANICIID",
                table: "GOREVLER",
                column: "UZERINEALANKULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_KULLANICI_GRUPLARI_GRUPID",
                table: "KULLANICI_GRUPLARI",
                column: "GRUPID");

            migrationBuilder.CreateIndex(
                name: "IX_KULLANICI_GRUPLARI_KULLANICIID",
                table: "KULLANICI_GRUPLARI",
                column: "KULLANICIID");

            migrationBuilder.CreateIndex(
                name: "IX_KULLANICILAR_EMAIL",
                table: "KULLANICILAR",
                column: "EMAIL",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AYARLAR");

            migrationBuilder.DropTable(
                name: "BILDIRIMLER");

            migrationBuilder.DropTable(
                name: "GOREV_ATAMA_LOGLARI");

            migrationBuilder.DropTable(
                name: "GOREV_DOSYALARI");

            migrationBuilder.DropTable(
                name: "GOREV_ETIKETLERI");

            migrationBuilder.DropTable(
                name: "GOREV_YORUMLARI");

            migrationBuilder.DropTable(
                name: "KULLANICI_GRUPLARI");

            migrationBuilder.DropTable(
                name: "ALT_GOREVLER");

            migrationBuilder.DropTable(
                name: "ETIKETLER");

            migrationBuilder.DropTable(
                name: "GOREVLER");

            migrationBuilder.DropTable(
                name: "GOREV_TIPLERI");

            migrationBuilder.DropTable(
                name: "GRUPLAR");

            migrationBuilder.DropTable(
                name: "KULLANICILAR");
        }
    }
}
