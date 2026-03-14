using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HukukGorev.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class AddUserHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "YONETICIID",
                table: "KULLANICILAR",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "KULLANICILAR",
                keyColumn: "ID",
                keyValue: 99,
                column: "YONETICIID",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_KULLANICILAR_YONETICIID",
                table: "KULLANICILAR",
                column: "YONETICIID");

            migrationBuilder.AddForeignKey(
                name: "FK_KULLANICILAR_KULLANICILAR_YONETICIID",
                table: "KULLANICILAR",
                column: "YONETICIID",
                principalTable: "KULLANICILAR",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KULLANICILAR_KULLANICILAR_YONETICIID",
                table: "KULLANICILAR");

            migrationBuilder.DropIndex(
                name: "IX_KULLANICILAR_YONETICIID",
                table: "KULLANICILAR");

            migrationBuilder.DropColumn(
                name: "YONETICIID",
                table: "KULLANICILAR");
        }
    }
}
