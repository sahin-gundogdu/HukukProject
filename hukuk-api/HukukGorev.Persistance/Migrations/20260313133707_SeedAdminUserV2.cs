using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HukukGorev.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUserV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "KULLANICILAR",
                columns: new[] { "ID", "AD", "AKTIF", "CREATEDAT", "CREATEDBY", "EMAIL", "ROL", "SIFREHASH", "SOYAD", "UPDATEDAT", "UPDATEDBY" },
                values: new object[] { 99, "Administrator", true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "admin@hukuk.com", 1, "a4ayc/80/OGda4BO/1o/V0etpOqiLx1JwB5S3beHW0s=", "Admin", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "KULLANICILAR",
                keyColumn: "ID",
                keyValue: 99);
        }
    }
}
